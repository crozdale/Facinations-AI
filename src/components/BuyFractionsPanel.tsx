import { useTranslation } from "react-i18next";

export default function BuyFractionsPanel() {
  const { t } = useTranslation();
  return (
    <div className="border rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4">{t("vault.buy_fractions_title", "Buy Fractions")}</h3>

      <input
        disabled
        placeholder={t("common.amount", "Amount")}
        className="w-full border rounded p-3 mb-4 bg-gray-100 cursor-not-allowed"
      />

      <button
        disabled
        className="w-full py-3 rounded bg-gray-200 text-gray-600 cursor-not-allowed"
      >
        {t("vault.buy_fractions_btn", "Buy (coming soon)")}
      </button>

      <p className="text-sm text-black/60 mt-3">
        {t("vault.buy_fractions_note", "Fraction purchases activate once the vault is live on-chain.")}
      </p>
    </div>
  );
}
