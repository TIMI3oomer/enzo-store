import { createContext, useContext, useEffect, useState } from "react";

const CurrencyContext = createContext(null);
const STORAGE_KEY = "enzo_currency_v1";

// Default currency in Palestine is ILS (₪)
// Approximate standard rates: 1 USD = 3.70 ILS, 1 JOD = 5.20 ILS
export const CURRENCIES = {
  ILS: { code: "ILS", symbolAr: "₪", symbolEn: "₪", rateFromILS: 1, name: "₪ ILS" },
  USD: { code: "USD", symbolAr: "$", symbolEn: "$", rateFromILS: 1 / 3.70, name: "$ USD" },
  JOD: { code: "JOD", symbolAr: "د.أ", symbolEn: "JOD", rateFromILS: 1 / 5.20, name: "د.أ JOD" },
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return CURRENCIES[saved] ? saved : "ILS";
    } catch {
      return "ILS";
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const activeCurrency = CURRENCIES[currency] || CURRENCIES.ILS;

  /**
   * Format price amount in the active currency and language direction
   * @param {number} amountInILS - base price in ILS
   * @param {string} lang - 'ar' or 'en'
   */
  const formatPrice = (amountInILS, lang = "ar") => {
    if (amountInILS === undefined || amountInILS === null) return "";
    const num = Number(amountInILS);
    if (isNaN(num)) return amountInILS;

    const converted = num * activeCurrency.rateFromILS;
    // Format nicely without trailing zeros if integer, else 2 decimals
    const formattedNum = converted % 1 === 0 ? converted.toFixed(0) : converted.toFixed(1);
    const symbol = lang === "ar" ? activeCurrency.symbolAr : activeCurrency.symbolEn;

    return lang === "ar" ? `${formattedNum} ${symbol}` : `${symbol}${formattedNum}`;
  };

  const value = {
    currency,
    setCurrency,
    activeCurrency,
    formatPrice,
    availableCurrencies: Object.values(CURRENCIES),
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
