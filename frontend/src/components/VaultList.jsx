import { useVaults } from "../hooks/useVaults";
import VaultCard from "../teleport/VaultCard";

export default function VaultList() {
  const { vaults, loading } = useVaults();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {vaults.map(vault => (
        <VaultCard
          key={vault.id}
          title={vault.vaultId}
          premiumRequired={vault.premiumRequired}
          onClick={() => console.log("open vault", vault.id)}
        />
      ))}
    </div>
  );
}
