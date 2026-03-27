import { useTranslation } from "react-i18next";

export default function FundingBadge({ isFullyFunded }) {
  const { t } = useTranslation();
  return (
    <span
      className={[
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold",
        isFullyFunded ? "bg-blue-600 text-white" : "bg-gray-800 text-white/90",
      ].join(" ")}
    >
      {isFullyFunded ? t("vault.fully_funded", "Fully Funded") : t("vault.not_fully_funded", "Not Fully Funded")}
    </span>
  );
}
