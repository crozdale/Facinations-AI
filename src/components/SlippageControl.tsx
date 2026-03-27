import { useTranslation } from "react-i18next";

export default function SlippageControl({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <div style={{ marginTop: "12px" }}>
      <label style={{ fontSize: "0.85rem" }}>
        {t("swap.slippage_label", "Slippage Tolerance (%)")}
      </label>

      <input
        type="number"
        min="0"
        step="0.1"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ marginLeft: "10px", width: "80px" }}
      />
    </div>
  );
}
