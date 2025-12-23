import { useParams } from "react-router-dom";
import { useState } from "react";
import { VAULTS } from "../data/vaults";
import LegalPack from "../components/LegalPack";

export default function Vault() {
  const { id } = useParams();
  const vault = VAULTS.find((v) => v.id === id);

  const [legalOk, setLegalOk] = useState(false);

  if (!vault) {
    return (
      <div className="p-10 text-red-500">
        Vault not found: {id}
      </div>
    );
  }

  return (
    <div className="p-10 space-y-10">
      <header>
        <h1 className="text-3xl font-semibold text-white">
          {vault.title}
        </h1>
        <p className="text-slate-400">{vault.artist}</p>
      </header>

      {/* On-chain actions (gated) */}
      <div className="flex gap-4">
        <button
          disabled={!legalOk}
          className={`rounded-md px-4 py-2 font-medium
            ${
              legalOk
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
        >
          Swap
        </button>

        <button
          disabled={!legalOk}
          className={`rounded-md px-4 py-2 font-medium
            ${
              legalOk
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
        >
          Buy
        </button>
      </div>

      {/* Legal acknowledgement */}
      <LegalPack vault={vault} onAcknowledge={setLegalOk} />
    </div>
  );
}
