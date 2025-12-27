import { useParams } from "react-router-dom";
import { FACINATIONS_FEATURES } from "../config/features";
import { getVaultById } from "../registry/vaultRegistry";

export default function Vault() {
  const { vaultId } = useParams();
  const vault = getVaultById(vaultId);

  if (!vault) {
    return (
      <div className="px-6 py-12 text-center">
        <h2 className="text-xl font-semibold">Vault Not Found</h2>
        <p className="mt-2 text-gray-600">
          This vault is not registered in the Canonical Vault Registry.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* HEADER */}
      <header className="mb-8 border-b pb-6">
        <h1 className="text-2xl font-bold">{vault.artwork.title}</h1>
        <p className="mt-1 text-gray-600">
          {vault.artwork.artist} · {vault.artwork.year}
        </p>
        <p className="mt-1 text-sm text-gray-500">{vault.vaultId}</p>
      </header>

      {/* STATUS */}
      <section className="mb-8 rounded-lg bg-gray-100 p-4 text-sm">
        {FACINATIONS_FEATURES.READ_ONLY_MODE && (
          <p>
            <strong>Status:</strong> Public Read-Only Mode. This vault is visible
            for review and verification only.
          </p>
        )}

        {!FACINATIONS_FEATURES.READ_ONLY_MODE &&
          FACINATIONS_FEATURES.MARKETPLACE_ENABLED && (
            <p>
              <strong>Status:</strong> Marketplace Active. Eligible actions may
              be available for this vault.
            </p>
          )}
      </section>

      {/* ARTWORK */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-semibold">Artwork</h2>
        <ul className="text-sm text-gray-700">
          <li>
            <strong>Title:</strong> {vault.artwork.title}
          </li>
          <li>
            <strong>Artist:</strong> {vault.artwork.artist}
          </li>
          <li>
            <strong>Year:</strong> {vault.artwork.year}
          </li>
          <li>
            <strong>Medium:</strong> {vault.artwork.medium}
          </li>
        </ul>
      </section>

      {/* LEGAL */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-semibold">Legal Documentation</h2>
        <p className="mb-2 text-sm text-gray-600">
          The following legal documentation governs this vault.
        </p>
        <a
          href={vault.legal.pdfPath}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white"
        >
          View Legal Pack
        </a>
      </section>

      {/* CHAIN */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-semibold">On-Chain Binding</h2>
        <ul className="text-sm text-gray-700">
          <li>
            <strong>Network:</strong> {vault.chain.name} (Chain ID{" "}
            {vault.chain.chainId})
          </li>
          <li>
            <strong>Vault Contract:</strong>{" "}
            {vault.contracts.vault || "Not yet deployed"}
          </li>
        </ul>
      </section>

      {/* ACTIONS — STRICTLY GATED */}
      {FACINATIONS_FEATURES.MINT_ENABLED &&
        vault.status === "active" && (
          <section className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h2 className="mb-2 text-lg font-semibold">
              Mint Fractional Interests
            </h2>
            <p className="mb-4 text-sm text-gray-700">
              Minting constitutes acquisition of a fractional interest governed
              by the attached legal documentation.
            </p>
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              Mint
            </button>
          </section>
        )}
    </div>
  );
}
