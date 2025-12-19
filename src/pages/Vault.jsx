import { useWeb3 } from "../providers/Web3Provider";
import { VAULTS } from "../data/vaultRegistry";
import VaultCard from "../components/VaultCard";

export default function Vault() {
  const { account, chainId } = useWeb3();

  if (!account) {
    return (
      <div>
        <h1 className="text-3xl font-semibold mb-4">Vault</h1>
        <p className="text-neutral-600">
          Connect your wallet to view vaults.
        </p>
      </div>
    );
  }

  const visibleVaults = VAULTS.filter(
    (v) => !v.network || v.network === chainId
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-2">Vault Dashboard</h1>
      <p className="text-neutral-600 mb-8">
        NFT-based vaults linked to xDALE Gallery
      </p>

      {visibleVaults.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No vaults available on this network.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleVaults.map((vault) => (
            <VaultCard key={vault.id} vault={vault} />
          ))}
        </div>
      )}
    </div>
  );
}
