import { useState } from "react";

export default function VaultLegalSection({ vault }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-14 pt-8 border-t border-black/10">
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm tracking-wide uppercase text-black/70">
          Legal Summary
        </h3>

        <span className="text-xs tracking-widest uppercase text-black/40">
          Revenue Participation Only
        </span>
      </div>

      {/* Always-visible statement */}
      <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-black/80">
        Owner retains legal title and physical possession of the artwork.
        Vault tokens represent contractual economic and governance interests only.
      </p>

      {/* Expandable detail */}
      {open && (
        <ul className="mt-6 max-w-3xl space-y-2 text-[14px] text-black/70 list-disc list-inside">
          <li>No ownership, custody, or possessory rights</li>
          <li>No copyright or intellectual property rights</li>
          <li>No right to force sale or access the artwork</li>
          <li>Custody and insurance maintained by third parties</li>
          <li>Blockchain records are evidentiary only</li>
        </ul>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <button
          onClick={() => setOpen(!open)}
          className="text-sm tracking-wide text-black/70 hover:text-black transition"
        >
          {open ? "Hide legal summary" : "View legal summary"}
        </button>

        <a
          href={vault.legalPackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2 text-sm tracking-wide bg-black text-white hover:bg-black/90 transition"
        >
          View Legal Pack
        </a>
      </div>

      {/* Footer meta */}
      <p className="mt-6 text-[11px] tracking-wide uppercase text-black/40">
        Governing Law: {vault.jurisdictionLabel} · Vault ID: {vault.id}
      </p>
    </section>
  );
}
