import { VAULTS } from "../data/vaults";
import VaultCard from "../components/VaultCard";

export default function Vault() {
  return (
    <div className="px-10 py-16">
      <h1 className="text-4xl font-bold mb-8">
        Vaults
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {VAULTS.map((vault) => (
          <VaultCard key={vault.id} vault={vault} />
        ))}
      </div>
    </div>
  );
}
