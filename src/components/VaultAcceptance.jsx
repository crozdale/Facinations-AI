export default function VaultAcceptance({ accepted, onChange }) {
  return (
    <div className="mt-12 pt-8 border-t border-black/10 max-w-3xl">
      <label className="flex items-start gap-4 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onChange(e.target.checked)}
          className="
            mt-1
            h-4 w-4
            accent-black
            border-black/40
            focus:ring-0
          "
        />

        <span className="text-[15px] leading-relaxed text-black/80">
          I acknowledge that Vault Tokens do not represent ownership,
          possession, or legal title to the physical artwork, and that
          my rights are limited to those expressly described in the
          Vault Participation Agreement and related legal documents.
        </span>
      </label>

      <p className="mt-3 text-[11px] tracking-wide uppercase text-black/40">
        Acceptance is recorded with your wallet address and timestamp
      </p>
    </div>
  );
}
