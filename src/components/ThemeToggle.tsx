import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ThemeToggle() {
  const { t } = useTranslation();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.className = dark ? "dark" : "light";
  }, [dark]);

  return (
    <button className="theme-toggle" onClick={() => setDark(!dark)}>
      {dark ? t("theme.dark", "🌙 Dark") : t("theme.light", "☀️ Light")}
    </button>
  );
}
