-- =====================================================================
-- ENZO STORE — MIGRATION 5 (COMPLETE SCALE & REVAMP)
-- File: /supabase/migration_v5_complete.sql
-- =====================================================================

-- 1. Enhance products table with badges, color options, review rating, sku
alter table if exists products 
  add column if not exists badges text[] default '{}',
  add column if not exists colors jsonb default '[]'::jsonb, -- e.g. [{"name": {"ar": "أبيض", "en": "White"}, "hex": "#FFFFFF"}]
  add column if not exists rating numeric(3,2) default 4.9,
  add column if not exists review_count int default 24,
  add column if not exists sku text;

-- 2. Wishlist table for saved customer items
create table if not exists wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

create index if not exists idx_wishlist_user on wishlist(user_id);
create index if not exists idx_wishlist_product on wishlist(product_id);

alter table wishlist enable row level security;

-- RLS policies for Wishlist
create policy "users can view own wishlist" on wishlist
  for select using (auth.uid() = user_id);

create policy "users can insert into own wishlist" on wishlist
  for insert with check (auth.uid() = user_id);

create policy "users can delete from own wishlist" on wishlist
  for delete using (auth.uid() = user_id);

-- 3. Promo codes table
create table if not exists promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percent', 'fixed', 'free_shipping')),
  discount_value numeric(10,2) not null default 0,
  min_order_value numeric(10,2) not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table promo_codes enable row level security;

-- Public can check active promo codes by code
create policy "public read active promo codes" on promo_codes
  for select using (is_active = true);

create policy "admin manage promo codes" on promo_codes
  for all using (is_admin()) with check (is_admin());

-- Seed initial promo codes for testing
insert into promo_codes (code, discount_type, discount_value, min_order_value, is_active) values
  ('ENZO10', 'percent', 10, 0, true),
  ('PALESTINE', 'free_shipping', 0, 100, true),
  ('VIP20', 'percent', 20, 250, true)
on conflict (code) do nothing;

-- 4. Storage buckets for high-res products and lookbook assets
insert into storage.buckets (id, name, public)
values 
  ('product-images', 'product-images', true),
  ('lookbook', 'lookbook', true)
on conflict (id) do update set public = true;

-- Storage RLS policies
create policy "public read product images" on storage.objects
  for select using (bucket_id in ('product-images', 'lookbook'));

create policy "admin upload product images" on storage.objects
  for insert with check (bucket_id in ('product-images', 'lookbook') and is_admin());

create policy "admin update product images" on storage.objects
  for update using (bucket_id in ('product-images', 'lookbook') and is_admin());

create policy "admin delete product images" on storage.objects
  for delete using (bucket_id in ('product-images', 'lookbook') and is_admin());

-- 5. Updated atomic place_order function supporting promo code & delivery fee
create or replace function place_order(
  p_customer_name text,
  p_phone text,
  p_city text,
  p_address text,
  p_notes text,
  p_payment_method text,
  p_locale text,
  p_user_id uuid,
  p_items jsonb, -- [{ "product_id": "...", "size": "M", "color": "White", "quantity": 2 }, ...]
  p_promo_code text default null
) returns table(order_id uuid, order_number bigint, total numeric, discount numeric, shipping numeric)
language plpgsql
security definer
as $$
declare
  v_order_id uuid;
  v_order_number bigint;
  v_subtotal numeric := 0;
  v_discount numeric := 0;
  v_shipping numeric := 20; -- Default West Bank shipping in ILS (₪20)
  v_total numeric := 0;
  v_item jsonb;
  v_product products%rowtype;
  v_qty int;
  v_promo promo_codes%rowtype;
begin
  if jsonb_array_length(p_items) = 0 then
    raise exception 'Cannot place an order with no items';
  end if;

  -- Calculate shipping based on delivery city
  if lower(p_city) in ('jerusalem', 'al-quds', 'القدس') then
    v_shipping := 30;
  elsif lower(p_city) in ('gaza', 'غزة', 'خان يونس', 'رفح') then
    v_shipping := 35;
  elsif lower(p_city) in ('48', 'haifa', 'jaffa', 'nazareth', 'عكا', 'حيفا', 'يافا', 'الناصرة', 'الداخل') then
    v_shipping := 50;
  else
    v_shipping := 20;
  end if;

  -- First pass: lock every product row involved and validate stock/price.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from products
      where id = (v_item->>'product_id')::uuid
      for update;

    if not found then
      raise exception 'Product not found: %', (v_item->>'product_id');
    end if;

    if not v_product.is_active then
      raise exception 'Product is no longer available: %', v_product.slug;
    end if;

    v_qty := (v_item->>'quantity')::int;
    if v_qty is null or v_qty <= 0 then
      raise exception 'Invalid quantity for product %', v_product.slug;
    end if;

    if v_product.stock < v_qty then
      raise exception 'Insufficient stock for %: only % left', v_product.slug, v_product.stock;
    end if;

    -- Real price comes from database
    v_subtotal := v_subtotal + (v_product.price * v_qty);
  end loop;

  -- Free shipping over ₪300 threshold
  if v_subtotal >= 300 then
    v_shipping := 0;
  end if;

  -- Apply promo code if provided
  if p_promo_code is not null and p_promo_code != '' then
    select * into v_promo from promo_codes
      where upper(code) = upper(p_promo_code)
        and is_active = true
        and (expires_at is null or expires_at > now())
      limit 1;

    if found and v_subtotal >= v_promo.min_order_value then
      if v_promo.discount_type = 'percent' then
        v_discount := round((v_subtotal * (v_promo.discount_value / 100.0)), 2);
      elsif v_promo.discount_type = 'fixed' then
        v_discount := least(v_promo.discount_value, v_subtotal);
      elsif v_promo.discount_type = 'free_shipping' then
        v_shipping := 0;
      end if;
    end if;
  end if;

  v_total := greatest(0, (v_subtotal - v_discount) + v_shipping);

  -- Insert order
  insert into orders (
    customer_name, phone, city, address, notes,
    payment_method, subtotal, total, locale, user_id
  ) values (
    p_customer_name, p_phone, p_city, p_address, p_notes,
    p_payment_method, v_subtotal, v_total, p_locale, p_user_id
  )
  returning id, orders.order_number into v_order_id, v_order_number;

  -- Insert line items and decrement stock
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select * into v_product from products where id = (v_item->>'product_id')::uuid;
    v_qty := (v_item->>'quantity')::int;

    insert into order_items (order_id, product_id, product_name, size, quantity, unit_price)
    values (v_order_id, v_product.id, v_product.name, v_item->>'size', v_qty, v_product.price);

    update products set stock = stock - v_qty where id = v_product.id;
  end loop;

  return query select v_order_id, v_order_number, v_total, v_discount, v_shipping;
end;
$$;

-- Enable Realtime for orders and products
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table products;
