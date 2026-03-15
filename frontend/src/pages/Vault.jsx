import { useParams } from "react-router-dom";
import { useVault } from "../hooks/useVault";
import { useSwaps } from "../hooks/useSwaps";
import { usePremium } from "../hooks/usePremium";
import SwapPanel from "../components/SwapPanel";
import SwapHistory from "../components/SwapHistory";

export default function Vault() {
  const { id } = useParams();

  const { data: vaultData, loading } = useVault(id);
  const vault = vaultData?.vault;

  const { swaps } = useSwaps(vault?.vaultId) || { swaps: [] };
  const { isPremium } = usePremium();

  if (loading || !vault) return <div>Loading vault...</div>;

  return (
    <div>
      <h2>{vault.vaultId}</h2>

      <SwapPanel
        swapAddress={vault.swapContract}
        premiumRequired={vault.premiumRequired}
        isPremium={isPremium}
      />

      <SwapHistory swaps={swaps} />
    </div>
  );
}
