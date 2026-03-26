import { useParams } from "react-router-dom";
import { useOnChainVaults } from "../hooks/useOnChainVaults";
import { usePremium } from "../hooks/usePremium";
import VaultInteraction from "../components/VaultInteraction";
import VaultSwap from "../components/VaultSwap";
import VaultActivityFeed from "../components/VaultActivityFeed";
import WalletGate from "../components/WalletGate";

export default function VaultPage() {
  const { vaultId } = useParams();
  const { vaults, loading } = useOnChainVaults();
  const { isPremium } = usePremium();

  if (loading) return <p>Loading…</p>;

  const vault = vaults.find(v => v.vaultId === vaultId);

  if (!vault) return <h2>Vault not found</h2>;

  return (
    <WalletGate>
      <main className="app-main">
        <h2>{vault.vaultId}</h2>

        <VaultInteraction vault={vault} />
        <VaultSwap vault={vault} />
        <VaultActivityFeed vault={vault} />
      </main>
    </WalletGate>
  );
}
