export default function VaultCard({ vault }) {
  return (
    <div className="border rounded-lg p-5 bg-white hover:shadow transition">
      <h3 className="text-lg font-medium">{vault.title}</h3>

      <p className="text-sm text-neutral-600 mt-1">
        {vault.artist} · {vault.year}
      </p>

      <p className="text-xs text-neutral-500 mt-2">
        {vault.vaultType} · {networkName(vault.network)}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-neutral-500">
          {vault.status}
        </span>

        <a
          href={vault.externalUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          View on xDALE →
        </a>
      </div>
    </div>
  );
}

function networkName(chainId) {
  switch (chainId) {
    case 1:
      return "Ethereum";
    case 137:
      return "Polygon";
    case 56:
      return "BSC";
    default:
      return `Chain ${chainId}`;
  }
}
