import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Ruler } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext.jsx";

const SIZE_DATA = {
  tops: [
    { size: "XS", chestCm: "96", chestIn: "37.8", lengthCm: "70", lengthIn: "27.5", shoulderCm: "48", shoulderIn: "18.9" },
    { size: "S", chestCm: "102", chestIn: "40.1", lengthCm: "72", lengthIn: "28.3", shoulderCm: "50", shoulderIn: "19.7" },
    { size: "M", chestCm: "108", chestIn: "42.5", lengthCm: "74", lengthIn: "29.1", shoulderCm: "52", shoulderIn: "20.5" },
    { size: "L", chestCm: "114", chestIn: "44.8", lengthCm: "76", lengthIn: "29.9", shoulderCm: "54", shoulderIn: "21.2" },
    { size: "XL", chestCm: "120", chestIn: "47.2", lengthCm: "78", lengthIn: "30.7", shoulderCm: "56", shoulderIn: "22.0" },
    { size: "XXL", chestCm: "126", chestIn: "49.6", lengthCm: "80", lengthIn: "31.5", shoulderCm: "58", shoulderIn: "22.8" },
  ],
  bottoms: [
    { size: "30 (S)", waistCm: "78", waistIn: "30.7", lengthCm: "98", lengthIn: "38.5", hipsCm: "98", hipsIn: "38.5" },
    { size: "32 (M)", waistCm: "83", waistIn: "32.6", lengthCm: "100", lengthIn: "39.3", hipsCm: "103", hipsIn: "40.5" },
    { size: "34 (L)", waistCm: "88", waistIn: "34.6", lengthCm: "102", lengthIn: "40.1", hipsCm: "108", hipsIn: "42.5" },
    { size: "36 (XL)", waistCm: "93", waistIn: "36.6", lengthCm: "104", lengthIn: "40.9", hipsCm: "113", hipsIn: "44.5" },
    { size: "38 (XXL)", waistCm: "98", waistIn: "38.5", lengthCm: "106", lengthIn: "41.7", hipsCm: "118", hipsIn: "46.5" },
  ],
  trainings: [
    { size: "S", chestCm: "104", lengthCm: "70", waistCm: "76-84", lengthBottom: "99" },
    { size: "M", chestCm: "110", lengthCm: "72", waistCm: "80-88", lengthBottom: "101" },
    { size: "L", chestCm: "116", lengthCm: "74", waistCm: "84-92", lengthBottom: "103" },
    { size: "XL", chestCm: "122", lengthCm: "76", waistCm: "88-96", lengthBottom: "105" },
  ],
};

export default function SizeGuideModal({ isOpen, onClose }) {
  const { t } = useTranslation("common");
  const { lang } = useLanguage();
  const [tab, setTab] = useState("tops");
  const [unit, setUnit] = useState("cm"); // 'cm' or 'inch'

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-2xl overflow-hidden rounded-xl border hairline bg-enzo-panel shadow-2xl p-6 text-start"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b hairline pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-enzo-gold/20 text-enzo-gold">
                  <Ruler size={18} />
                </div>
                <div>
                  <h3 className="font-display text-xl">{t("sizeGuide.title")}</h3>
                  <p className="text-xs text-enzo-muted">{t("sizeGuide.subtitle")}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-enzo-muted hover:bg-enzo-black hover:text-enzo-white transition-colors"
                aria-label="close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Controls */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              {/* Category Tabs */}
              <div className="flex rounded-lg border hairline bg-enzo-black/60 p-1">
                <button
                  onClick={() => setTab("tops")}
                  className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    tab === "tops" ? "bg-enzo-gold text-enzo-black font-semibold" : "text-enzo-muted hover:text-enzo-white"
                  }`}
                >
                  {t("sizeGuide.tabs.tops")}
                </button>
                <button
                  onClick={() => setTab("bottoms")}
                  className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    tab === "bottoms" ? "bg-enzo-gold text-enzo-black font-semibold" : "text-enzo-muted hover:text-enzo-white"
                  }`}
                >
                  {t("sizeGuide.tabs.bottoms")}
                </button>
                <button
                  onClick={() => setTab("trainings")}
                  className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    tab === "trainings" ? "bg-enzo-gold text-enzo-black font-semibold" : "text-enzo-muted hover:text-enzo-white"
                  }`}
                >
                  {t("sizeGuide.tabs.trainings")}
                </button>
              </div>

              {/* Unit Switcher */}
              <div className="flex rounded-lg border hairline bg-enzo-black/60 p-1 text-xs">
                <button
                  onClick={() => setUnit("cm")}
                  className={`rounded px-2.5 py-1 font-medium ${
                    unit === "cm" ? "bg-enzo-white text-enzo-black font-bold" : "text-enzo-muted"
                  }`}
                >
                  CM
                </button>
                <button
                  onClick={() => setUnit("inch")}
                  className={`rounded px-2.5 py-1 font-medium ${
                    unit === "inch" ? "bg-enzo-white text-enzo-black font-bold" : "text-enzo-muted"
                  }`}
                >
                  INCH
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-x-auto rounded-lg border hairline">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-enzo-black text-enzo-muted">
                  {tab === "tops" && (
                    <tr>
                      <th className="px-4 py-3 text-start">{t("sizeGuide.headers.size")}</th>
                      <th className="px-4 py-3 text-start">{t("sizeGuide.headers.chest")}</th>
                      <th className="px-4 py-3 text-start">{t("sizeGuide.headers.length")}</th>
                      <th className="px-4 py-3 text-start">{t("sizeGuide.headers.shoulder")}</th>
                    </tr>
                  )}
                  {tab === "bottoms" && (
                    <tr>
                      <th className="px-4 py-3 text-start">{t("sizeGuide.headers.size")}</th>
                      <th className="px-4 py-3 text-start">{t("sizeGuide.headers.waist")}</th>
                      <th className="px-4 py-3 text-start">{t("sizeGuide.headers.length")}</th>
                      <th className="px-4 py-3 text-start">{t("sizeGuide.headers.hips")}</th>
                    </tr>
                  )}
                  {tab === "trainings" && (
                    <tr>
                      <th className="px-4 py-3 text-start">{t("sizeGuide.headers.size")}</th>
                      <th className="px-4 py-3 text-start">{t("sizeGuide.headers.chest")}</th>
                      <th className="px-4 py-3 text-start">{lang === "ar" ? "طول الكنزة" : "Top Length"}</th>
                      <th className="px-4 py-3 text-start">{t("sizeGuide.headers.waist")}</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-enzo-line">
                  {tab === "tops" &&
                    SIZE_DATA.tops.map((row) => (
                      <tr key={row.size} className="hover:bg-enzo-black/40 transition-colors">
                        <td className="px-4 py-2.5 font-bold text-enzo-gold">{row.size}</td>
                        <td className="px-4 py-2.5">{unit === "cm" ? row.chestCm : row.chestIn}</td>
                        <td className="px-4 py-2.5">{unit === "cm" ? row.lengthCm : row.lengthIn}</td>
                        <td className="px-4 py-2.5">{unit === "cm" ? row.shoulderCm : row.shoulderIn}</td>
                      </tr>
                    ))}
                  {tab === "bottoms" &&
                    SIZE_DATA.bottoms.map((row) => (
                      <tr key={row.size} className="hover:bg-enzo-black/40 transition-colors">
                        <td className="px-4 py-2.5 font-bold text-enzo-gold">{row.size}</td>
                        <td className="px-4 py-2.5">{unit === "cm" ? row.waistCm : row.waistIn}</td>
                        <td className="px-4 py-2.5">{unit === "cm" ? row.lengthCm : row.lengthIn}</td>
                        <td className="px-4 py-2.5">{unit === "cm" ? row.hipsCm : row.hipsIn}</td>
                      </tr>
                    ))}
                  {tab === "trainings" &&
                    SIZE_DATA.trainings.map((row) => (
                      <tr key={row.size} className="hover:bg-enzo-black/40 transition-colors">
                        <td className="px-4 py-2.5 font-bold text-enzo-gold">{row.size}</td>
                        <td className="px-4 py-2.5">{row.chestCm} cm</td>
                        <td className="px-4 py-2.5">{row.lengthCm} cm</td>
                        <td className="px-4 py-2.5">{row.waistCm} cm</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Note */}
            <div className="mt-4 rounded-lg bg-enzo-black/60 p-3 text-xs text-enzo-muted">
              <span className="font-semibold text-enzo-white">💡 {lang === "ar" ? "نصيحة المنسق:" : "Stylist Tip:"}</span>{" "}
              {lang === "ar"
                ? "إذا كنت تفضل القصة العريضة والمنسدلة (Oversized Streetwear Look)، نوصي باختيار مقاس واحد أكبر من مقاسك المعتاد."
                : "For an intentional draped, oversized streetwear silhouette, select one size up from your usual tailored measurement."}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
