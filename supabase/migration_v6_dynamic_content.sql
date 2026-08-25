-- =====================================================================
-- ENZO STORE — MIGRATION 6 (DYNAMIC TAXONOMY & CONTENT MANAGEMENT)
-- File: /supabase/migration_v6_dynamic_content.sql
-- =====================================================================

-- 1. Enhance categories table with cover image, bilingual description, and display ordering
alter table if exists categories
  add column if not exists image text,
  add column if not exists description jsonb default '{}'::jsonb,
  add column if not exists sort_order int default 0;

-- Ensure RLS on categories
alter table categories enable row level security;

-- Drop prior policies if needed and re-apply cleanly
drop policy if exists "public read categories" on categories;
drop policy if exists "admin write categories" on categories;

create policy "public read categories" on categories
  for select using (true);

create policy "admin write categories" on categories
  for all using (is_admin()) with check (is_admin());

-- 2. Ensure Storage bucket 'product-images' exists and is public
insert into storage.buckets (id, name, public)
values 
  ('product-images', 'product-images', true),
  ('lookbook', 'lookbook', true)
on conflict (id) do update set public = true;

-- Storage object policies
create policy "public read product images" on storage.objects
  for select using (bucket_id in ('product-images', 'lookbook'));

create policy "admin upload product images" on storage.objects
  for insert with check (bucket_id in ('product-images', 'lookbook') and is_admin());

create policy "admin update product images" on storage.objects
  for update using (bucket_id in ('product-images', 'lookbook') and is_admin());

create policy "admin delete product images" on storage.objects
  for delete using (bucket_id in ('product-images', 'lookbook') and is_admin());

-- 3. Seed / Upsert Core Categories with High-Res Editorial Photography
insert into categories (slug, name, description, image, sort_order)
values
  (
    'polos',
    '{"ar": "قمصان بولو فاخرة", "en": "Luxury Polos"}',
    '{"ar": "قصات إيطالية أنيقة منسوجة من أجود خيوط القطن المحبوك والحرير الفاخر.", "en": "Quiet luxury Italian knitwear, ribbed textures, and premium cotton compositions."}',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    1
  ),
  (
    't-shirts',
    '{"ar": "تيشيرتات بريميوم", "en": "Premium Tees"}',
    '{"ar": "خامة ثقيلة 280GSM بقصة أوفر سايز معمارية ثابتة ولمسة ناعمة.", "en": "Heavyweight 280GSM luxury cottons engineered for structured drape and longevity."}',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    2
  ),
  (
    'trousers',
    '{"ar": "بناطيل وسراويل رسمية", "en": "Tailored Trousers"}',
    '{"ar": "بناطيل بقصات كلاسيكية وكسرات أمامية تمنحك إطلالة راقية في كافة المناسبات.", "en": "Pleated chinos and structured smart trousers tailored for modern silhouette."}',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    3
  ),
  (
    'training',
    '{"ar": "أطقم وتدريب راقية", "en": "Luxury Sets & Track"}',
    '{"ar": "أطقم قطنية متناسقة تجمع بين الراحة اليومية والأناقة المعاصرة.", "en": "Refined matching sets and minimal track loungewear crafted from premium fleece."}',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    4
  ),
  (
    'jackets',
    '{"ar": "سترات وجاكيتات", "en": "Jackets & Outerwear"}',
    '{"ar": "جاكيتات وسترات مصممة بعناية فائقة للحماية والأناقة في الأجواء المتقلبة.", "en": "Sophisticated overshirts, tailored bombers, and transitional outerwear."}',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    5
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image = excluded.image,
  sort_order = excluded.sort_order;
