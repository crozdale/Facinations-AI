import { useTranslation } from "react-i18next";
import { setLanguage } from "../i18n";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language}
      onChange={(e) => setLanguage(e.target.value)}
      style={{
        background: "transparent",
        color: "#fff",
        border: "1px solid #555",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      <option value="en">EN</option>
      <option value="fr">FR</option>
      <option value="es">ES</option>
      <option value="de">DE</option>
      <option value="it">IT</option>
    </select>
  );
}
