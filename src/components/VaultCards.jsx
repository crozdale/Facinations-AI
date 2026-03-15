// src/components/VaultCards.jsx

// Helper: shorten long hex strings
function shortenAddress(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export default function VaultCards({ vaults }) {
  if (!vaults || vaults.length === 0) {
    return <p>No vaults indexed yet.</p>;
  }

  return (
    <div className="vault-grid">
      {vaults.map((vault) => {
        const etherscanUrl = `https://etherscan.io/token/${vault.contractAddress}?a=${vault.tokenId}`;

        return (
          <article key={vault.id} className="vault-card">
            <header className="vault-card__header">
              <h3 className="vault-card__title">Vault {vault.vaultId}</h3>
              <span className="vault-card__id">#{vault.id}</span>
            </header>

            <div className="vault-card__body">
              <p className="vault-card__field">
                <strong>Token ID:</strong> {vault.tokenId}
              </p>
              <p className="vault-card__field">
                <strong>Contract:</strong>{" "}
                <span title={vault.contractAddress}>
                  {shortenAddress(vault.contractAddress)}
                </span>
              </p>
            </div>

            <footer className="vault-card__footer">
              <a
                href={etherscanUrl}
                className="vault-card__link"
                target="_blank"
                rel="noreferrer"
              >
                View on Etherscan
              </a>
            </footer>
          </article>
        );
      })}
    </div>
  );
}

