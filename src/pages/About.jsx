export default function About() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 px-6 py-12 flex justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-semibold mb-4">About Facinations</h1>

        <p className="text-sm text-zinc-300 mb-6">
          Facinations is a fine art–first platform for cultural capital. It
          fractionalizes museum-grade works into programmable vaults and turns
          provenance into a liquid, composable financial primitive.
        </p>

        <h2 className="text-lg font-medium mb-2">Why Now</h2>
        <p className="text-sm text-zinc-400 mb-4">
          The global fine art market is large, illiquid, and structurally
          opaque. Facinations introduces a protocol layer that unlocks secondary
          liquidity while preserving the discretion and prestige of traditional
          art markets.
        </p>

        <h2 className="text-lg font-medium mb-2">How It Works</h2>
        <ul className="text-sm text-zinc-400 mb-4 list-disc list-inside space-y-1">
          <li>Gallery: discovery of curated works and civilization narratives.</li>
          <li>Collection & Exchange: private, fine art–native secondary market.</li>
          <li>Vaults: institutional-grade custody and provenance memory layer.</li>
        </ul>

        <h2 className="text-lg font-medium mb-2">Team</h2>
        <p className="text-sm text-zinc-400 mb-6">
          Facinations is built by a team at the intersection of fine art,
          blockchain protocol design, and narrative systems, with experience
          across galleries, DeFi, and cultural production.
        </p>

        <button
          className="px-4 py-2 rounded border border-zinc-700 text-sm hover:bg-zinc-800 transition"
          onClick={() => {
            window.location.href =
              "mailto:founder@facinations.app?subject=Investor%20Inquiry";
          }}
        >
          Request Investor Deck
        </button>
      </div>
    </div>
  );
}
