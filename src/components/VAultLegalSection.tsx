import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function VaultLegalSection({ vault }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-14 pt-8 border-t border-black/10">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm tracking-wide uppercase text-black/70">
          {t("vaultLegal.summary_title")}
        </h3>

        <span className="text-xs tracking-widest uppercase text-black/40">
          {t("vaultLegal.revenue_only")}
        </span>
      </div>

      {/* Always-visible statement */}
      <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-black/80">
        {t("vaultLegal.statement")}
      </p>

      {/* Expandable detail */}
      {open && (
        <ul className="mt-6 max-w-3xl space-y-2 text-[14px] text-black/70 list-disc list-inside">
          <li>{t("vaultLegal.no_ownership")}</li>
          <li>{t("vaultLegal.no_copyright")}</li>
          <li>{t("vaultLegal.no_force_sale")}</li>
          <li>{t("vaultLegal.third_party")}</li>
          <li>{t("vaultLegal.blockchain_only")}</li>
        </ul>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <button
          onClick={() => setOpen(!open)}
          className="text-sm tracking-wide text-black/70 hover:text-black transition"
        >
          {open ? t("vaultLegal.hide_summary") : t("vaultLegal.view_summary")}
        </button>

        <a
          href={vault.legalPackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2 text-sm tracking-wide bg-black text-white hover:bg-black/90 transition"
        >
          {t("vaultLegal.view_legal_pack")}
        </a>
      </div>

      {/* Footer meta */}
      <p className="mt-6 text-[11px] tracking-wide uppercase text-black/40">
        Governing Law: {vault.jurisdictionLabel} · Vault ID: {vault.id}
      </p>
    </section>
  );
}
