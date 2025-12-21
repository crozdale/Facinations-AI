import { Link } from "react-router-dom";

export default function VaultCard({ vault }) {
  return (
    <Link
      to={`/vault/${vault.id}`}
      className="block border rounded-xl p-6 hover:shadow-lg transition"
    >
      <h3 className="text-xl font-semibold mb-1">
        {vault.title}
      </h3>

      <p className="text-sm text-black/70">
        {vault.artist}
      </p>

      <div className="mt-4 text-sm">
        <div>{vault.vaultType}</div>
        <div>Chain {vault.chainId}</div>
        <div className="mt-1 text-green-700">
          {vault.status}
        </div>
      </div>
    </Link>
  );
}
