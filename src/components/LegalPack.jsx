import { useEffect, useMemo, useState } from "react";

export default function LegalPack({ vault, onAcknowledge }) {
  if (!vault?.legal?.packs) return null;

  const { packs, default: defaultJurisdiction } = vault.legal;
  const jurisdictions = Object.keys(packs);

  const [jurisdiction, setJurisdiction] = useState(
    defaultJurisdiction ?? jurisdictions[0]
  );

  const active = packs[jurisdiction];
  const href = `/vaults/${vault.vaultId}/${active.filename}`;

  const storageKey = useMemo(
    () =>
      `legal_ack:${vault.vaultId}:${jurisdiction}:${active.version}:${active.sha256}`,
    [vault.vaultId, jurisdiction, active.version, active.sha256]
  );

  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    const ok = stored === "true";
    setAcknowledged(ok);
    onAcknowledge?.(ok);
  }, [storageKey, onAcknowledge]);

  function handleAcknowledge(e) {
    const checked = e.target.checked;
    setAcknowledged(checked);
    localStorage.setItem(storageKey, String(checked));
    onAcknowledge?.(checked);
  }

  return (
    <section className="mt-10 rounded-xl border border-slate-700 bg-slate-900 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">
        Legal & Disclosures
      </h3>

      <p className="text-sm text-slate-400">
        Select your jurisdiction, review the legal document, and acknowledge
        before proceeding.
      </p>

      {/* Jurisdiction selector */}
      <div className="flex flex-wrap gap-2">
        {jurisdictions.map((code) => (
          <button
            key={code}
            onClick={() => setJurisdiction(code)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition
              ${
                code === jurisdiction
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
          >
            {packs[code].label}
          </button>
        ))}
      </div>

      {/* Legal link */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition"
      >
        View Legal Pack ({active.label})
      </a>

      {/* Hash display */}
      <div className="rounded-md bg-slate-950 p-3 text-xs text-slate-300 break-all">
        <div className="text-slate-400 mb-1">Document SHA-256</div>
        <code>{active.sha256}</code>
      </div>

      {/* Acknowledgement */}
      <label className="flex items-start gap-3 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={handleAcknowledge}
          className="mt-1"
        />
        <span>
          I confirm that I have reviewed the legal document corresponding to
          the hash shown above.
        </span>
      </label>

      <p className="text-xs text-slate-500">
        Jurisdiction: {jurisdiction} · Version {active.version}
      </p>
    </section>
  );
}
