import { useTranslation } from "react-i18next";

export default function LegalViewer({ pdf, hash }) {
  const { t } = useTranslation();
  return (
    <section className="legal-viewer">
      <h3>{t("legalViewer.title")}</h3>

      <a
        href={pdf}
        target="_blank"
        rel="noopener noreferrer"
        className="btn"
      >
        {t("legalViewer.view_pdf")}
      </a>

      <p className="hash">
        {t("legalViewer.doc_hash")} <code>{hash}</code>
      </p>
    </section>
  );
}
