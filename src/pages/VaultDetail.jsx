import { useParams } from "react-router-dom";
import { VAULTS } from "../data/vaults";
import FractionStats from "../components/FractionStats";
import BuyFractionsPanel from "../components/BuyFractionsPanel";

export default function VaultDetail() {
  const { id } = useParams();
  const vault = VAULTS.find((v) => v.id === id);

  if (!vault) {
    return <div className="px-10 py-16">Vault not found.</div>;
  }

  return (
    <div className="px-10 py-16 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2">{vault.title}</h1>
        <p className="text-lg text-black/70">
          {vault.artist} · {vault.year} · {vault.medium}
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Stat label="Vault Type" value={vault.vaultType} />
        <Stat label="Chain" value={`Chain ${vault.chainId}`} />
        <Stat label="Status" value={vault.status} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Fractions</h2>
        <FractionStats fraction={vault.fraction} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BuyFractionsPanel />
        <div className="border rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Redeem</h3>
          <button
            disabled
            className="w-full py-3 rounded bg-gray-200 text-gray-600 cursor-not-allowed"
          >
            Redeem (coming soon)
          </button>
        </div>
      </section>

      <p className="text-sm text-black/60 mt-3">
        Actions will activate once the vault is live on-chain.
      </p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="text-sm text-black/60">{label}</div>
      <div className="text-lg font-medium">{value}</div>
    </div>
  );
}
