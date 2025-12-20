
import { VAULTS } from "../registry/vaultRegistry";
import ActionLink from "../components/ActionLink";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-medium text-black/70">
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs font-semibold text-black/70">
      {status || "unknown"}
    </span>
  );
}

function VaultCard({ vault }) {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <img
        src="/logos/file_000000007664723087835154623dcdd2-909afde2-6657-4a4b-bdba-4bff6a945004.png"
        alt=""
        className="pointer-events-none absolute right-2 bottom-2 h-2 w-2 opacity-[0.12]"
      />

      <div className="flex items-start justify-between gap-4">
        <div className="pr-4">
          <h3 className="font-serif text-xl font-semibold">
            {vault.title}
          </h3>
          <p className="mt-1 text-sm text-black/60">
            {vault.artist}
          </p>
        </div>
        <StatusBadge status={vault.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{vault.vaultType || "Vault"}</Badge>
        <Badge>Chain {vault.network}</Badge>
        <Badge>{vault.contract ? "Contract set" : "No contract"}</Badge>
      </div>

      <div className="mt-6">
        <ActionLink to={`/vault/${vault.id}`}>
          Open vault
        </ActionLink>
      </div>
    </div>
  );
}

export default function Vault() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold">
          Vault Dashboard
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-black/60">
          Canonical index of Façinations vaults.
        </p>
      </header>

      <section className="mt-12">
        <div className="grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VAULTS.map((vault) => (
            <VaultCard key={vault.id} vault={vault} />
          ))}
        </div>
      </section>
    </div>
  );
}