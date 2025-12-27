export default function VaultCard({ vault }) {
  return (
    <div className="vault-card">
      <img src={vault.image} alt={vault.name} />
      <h3>{vault.name}</h3>
      <p>{vault.description}</p>

      <a
        href={`https://ipfs.io/ipfs/${vault.ipfs.replace("ipfs://", "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="vault-link"
      >
        View on IPFS
      </a>
    </div>
  );
}
