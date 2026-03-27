import { useTranslation } from "react-i18next";

export default function Disclaimer() {
  const { t } = useTranslation();
  return (
    <main className="legal">
      <h1>{t("legal.disclaimer_title", "Disclaimer")}</h1>
      <p>{t("legal.disclaimer_body", "Facinations provides provenance tools only. No financial or legal advice is given.")}</p>
    </main>
  );
}
