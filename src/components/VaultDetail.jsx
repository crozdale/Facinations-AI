// src/components/VaultDetail.jsx
export default function VaultDetail({ vault }) {
  if (!vault) {
    return <p>Vault not found.</p>;
  }

  const etherscanUrl = `https://etherscan.io/token/${vault.contractAddress}?a=${vault.tokenId}`;

  return (
    <div className="vault-detail">
      <h2>Vault {vault.vaultId}</h2>
      <p><strong>ID:</strong> {vault.id}</p>
      <p><strong>Token ID:</strong> {vault.tokenId}</p>
      <p><strong>Contract:</strong> {vault.contractAddress}</p>
      <p>
        <a href={etherscanUrl} target="_blank" rel="noreferrer">
          View on Etherscan
        </a>
      </p>
    </div>
  );
}
