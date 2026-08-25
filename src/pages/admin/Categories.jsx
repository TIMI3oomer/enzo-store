import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Edit2, Trash2, Upload, ExternalLink, Image as ImageIcon, Check, X, ArrowUpDown, Layers } from "lucide-react";
import { api } from "../../lib/api.js";
import { useLocalizedField, useLanguage } from "../../context/LanguageContext.jsx";
import AdminLayout from "../../components/AdminLayout.jsx";

const emptyCat = {
  slug: "",
  name_ar: "",
  name_en: "",
  description_ar: "",
  description_en: "",
  image: "",
  sort_order: 0,
};

export default function AdminCategories() {
  const { t } = useTranslation("admin");
  const { lang } = useLanguage();
  const localize = useLocalizedField();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyCat);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api.get("/admin/categories");
      setCategories(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenAdd() {
    setEditingId(null);
    setForm({ ...emptyCat, sort_order: categories.length + 1 });
    setError("");
    setModalOpen(true);
  }

  function handleOpenEdit(cat) {
    setEditingId(cat.id);
    setForm({
      slug: cat.slug || "",
      name_ar: cat.name?.ar || "",
      name_en: cat.name?.en || "",
      description_ar: cat.description?.ar || "",
      description_en: cat.description?.en || "",
      image: cat.image || "",
      sort_order: cat.sort_order ?? 0,
    });
    setError("");
    setModalOpen(true);
  }

  async function handleDelete(cat) {
    if (!confirm(lang === "ar" ? `هل أنت متأكد من حذف تصنيف "${localize(cat.name)}"` : `Are you sure you want to delete category "${localize(cat.name)}"?`)) {
      return;
    }
    try {
      await api.del(`/admin/categories/${cat.id}`);
      load();
    } catch (err) {
      alert(err.message || "Failed to delete category");
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const res = await api.upload(file);
      if (res?.url) {
        setForm((f) => ({ ...f, image: res.url }));
      }
    } catch (err) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      slug: form.slug.trim().toLowerCase(),
      name: { ar: form.name_ar.trim(), en: form.name_en.trim() },
      description: { ar: form.description_ar.trim(), en: form.description_en.trim() },
      image: form.image.trim(),
      sort_order: Number(form.sort_order) || 0,
    };

    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, payload);
      } else {
        await api.post("/admin/categories", payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title={lang === "ar" ? "إدارة التصنيفات والأقسام" : "Category Management"}>
      <div className="space-y-6 text-start">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-enzo-muted">
              {lang === "ar"
                ? "إضافة وتعديل أقسام المتجر، الصور الترويجية والترتيب المعروض على الصفحة الرئيسية والملاحة."
                : "Create and customize store categories, lookbook banners, and navigation menus."}
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-enzo-gradient px-4 py-2.5 text-xs font-bold text-enzo-black shadow-md hover:opacity-95 transition-opacity"
          >
            <Plus size={16} />
            <span>{lang === "ar" ? "إضافة تصنيف جديد" : "Add New Category"}</span>
          </button>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto rounded-xl border hairline bg-enzo-panel shadow-sm">
          <table className="w-full text-start text-sm">
            <thead className="border-b hairline bg-enzo-black/60 text-xs font-bold uppercase tracking-wider text-enzo-muted">
              <tr>
                <th className="px-5 py-3.5 text-start">{lang === "ar" ? "الصورة" : "Image"}</th>
                <th className="px-5 py-3.5 text-start">{lang === "ar" ? "التصنيف (عربي / English)" : "Category Name"}</th>
                <th className="px-5 py-3.5 text-start">URL Slug</th>
                <th className="px-5 py-3.5 text-start">{lang === "ar" ? "المنتجات" : "Products"}</th>
                <th className="px-5 py-3.5 text-start">{lang === "ar" ? "الترتيب" : "Sort"}</th>
                <th className="px-5 py-3.5 text-end">{lang === "ar" ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y hairline">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-enzo-muted text-xs">
                    {lang === "ar" ? "جاري تحميل التصنيفات..." : "Loading categories..."}
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-enzo-muted text-xs">
                    {lang === "ar" ? "لا توجد تصنيفات حالياً. أضف أول تصنيف الآن." : "No categories found. Create your first category above."}
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="h-12 w-12 rounded-lg border hairline overflow-hidden bg-enzo-black flex items-center justify-center">
                        {cat.image ? (
                          <img src={cat.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon size={18} className="text-enzo-muted" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-enzo-white">{cat.name?.en || cat.name?.ar}</p>
                      <p className="text-xs text-enzo-gold/80">{cat.name?.ar}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded bg-enzo-black px-2 py-1 font-mono text-xs text-enzo-muted border hairline">
                        /shop/{cat.slug}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-enzo-gold/10 px-2.5 py-0.5 text-xs font-bold text-enzo-gold border border-enzo-gold/30">
                        {cat.product_count || 0}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-enzo-muted font-mono">
                      #{cat.sort_order ?? 0}
                    </td>
                    <td className="px-5 py-3.5 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/shop/${cat.slug}`}
                          target="_blank"
                          className="rounded-lg border hairline p-1.5 text-enzo-muted hover:text-white hover:border-enzo-gold"
                          title="View on Storefront"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="rounded-lg border hairline p-1.5 text-enzo-muted hover:text-enzo-gold hover:border-enzo-gold"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="rounded-lg border hairline p-1.5 text-enzo-muted hover:text-enzo-error hover:border-enzo-error"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal: Add / Edit Category */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-xl rounded-2xl border hairline bg-enzo-panel p-6 shadow-2xl animate-scale-in">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 end-5 text-enzo-muted hover:text-white"
              >
                <X size={20} />
              </button>

              <h2 className="font-display text-xl text-enzo-white mb-5">
                {editingId
                  ? lang === "ar"
                    ? "تعديل بيانات التصنيف"
                    : "Edit Category"
                  : lang === "ar"
                  ? "إضافة تصنيف جديد"
                  : "Add New Category"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-enzo-muted mb-1">
                      {lang === "ar" ? "الاسم بالعربية" : "Arabic Name"}
                    </label>
                    <input
                      className="input text-sm"
                      dir="rtl"
                      value={form.name_ar}
                      onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                      placeholder="مثال: قمصان بولو"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-enzo-muted mb-1">
                      {lang === "ar" ? "الاسم بالإنجليزية" : "English Name"}
                    </label>
                    <input
                      className="input text-sm"
                      dir="ltr"
                      value={form.name_en}
                      onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                      placeholder="e.g. Luxury Polos"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-enzo-muted mb-1">
                      URL Slug
                    </label>
                    <input
                      className="input text-sm font-mono"
                      dir="ltr"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="e.g. polos"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-enzo-muted mb-1">
                      {lang === "ar" ? "ترتيب العرض" : "Sort Order"}
                    </label>
                    <input
                      type="number"
                      className="input text-sm"
                      value={form.sort_order}
                      onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-enzo-muted mb-1">
                    {lang === "ar" ? "الوصف بالعربية" : "Arabic Description"}
                  </label>
                  <textarea
                    rows={2}
                    className="input text-sm"
                    dir="rtl"
                    value={form.description_ar}
                    onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                    placeholder="وصف مختصر للتصنيف يظهر في الترويسة..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-enzo-muted mb-1">
                    {lang === "ar" ? "الوصف بالإنجليزية" : "English Description"}
                  </label>
                  <textarea
                    rows={2}
                    className="input text-sm"
                    dir="ltr"
                    value={form.description_en}
                    onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                    placeholder="Short category description for headers..."
                  />
                </div>

                {/* Secure Image Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-enzo-muted mb-1">
                    {lang === "ar" ? "صورة الغلاف / البانر" : "Cover / Banner Image"}
                  </label>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 rounded-lg border border-enzo-gold/40 bg-enzo-gold/10 px-3.5 py-2 text-xs font-bold text-enzo-gold cursor-pointer hover:bg-enzo-gold hover:text-enzo-black transition-colors">
                      <Upload size={14} />
                      <span>{uploading ? (lang === "ar" ? "جاري الرفع..." : "Uploading...") : (lang === "ar" ? "رفع صورة آمنة" : "Upload Secure Image")}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="input text-xs flex-1"
                    />

                    {form.image && (
                      <div className="h-9 w-9 rounded border hairline overflow-hidden flex-none">
                        <img src={form.image} alt="" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-enzo-muted">
                    {lang === "ar"
                      ? "يتم فحص وتأمين كافة الصور المرفوعة (JPEG, PNG, WebP) وتشفير أسماء الملفات تلقائياً."
                      : "Strictly validated for genuine image headers (JPEG, PNG, WebP). Executables & scripts blocked."}
                  </p>
                </div>

                {error && (
                  <p className="text-xs text-enzo-error bg-enzo-error/10 border border-enzo-error/30 p-3 rounded-lg">
                    {error}
                  </p>
                )}

                <div className="pt-3 flex justify-end gap-3 border-t hairline">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-lg border hairline px-4 py-2 text-xs font-semibold text-enzo-muted hover:text-white"
                  >
                    {lang === "ar" ? "إلغاء" : "Cancel"}
                  </button>

                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="rounded-lg bg-enzo-gradient px-6 py-2 text-xs font-bold text-enzo-black shadow disabled:opacity-50"
                  >
                    {saving
                      ? lang === "ar"
                        ? "جاري الحفظ..."
                        : "Saving..."
                      : lang === "ar"
                      ? "حفظ التصنيف"
                      : "Save Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
