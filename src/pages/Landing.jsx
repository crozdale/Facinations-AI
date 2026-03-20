// src/pages/Landing.jsx
import { Link } from "react-router-dom";
import { DealerIntelligencePanel } from "../components/dealer/DealerIntelligencePanel";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center px-6 py-12">
      <header className="max-w-3xl text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold mb-3">
          Own Civilization. Exchange Culture.
        </h1>
        <p className="text-sm md:text-base text-zinc-400">
          Facinations turns fine art into liquid cultural capital across
          investors, collectors, creators, and partners. Choose your role.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <div className="border border-zinc-800 rounded-lg p-5">
          <h2 className="text-lg font-medium mb-1">Venture Capitalists</h2>
          <p className="text-xs text-zinc-400 mb-4">
            Understand the protocol, market, and vision behind Facinations.
          </p>
          <div className="flex gap-3 text-sm">
            <Link to="/about" className="px-3 py-1.5 border border-zinc-700 rounded">
              About
            </Link>
            <Link to="/whitepaper" className="px-3 py-1.5 border border-zinc-700 rounded">
              Whitepaper
            </Link>
          </div>
        </div>

        <div className="border border-zinc-800 rounded-lg p-5">
          <h2 className="text-lg font-medium mb-1">Collectors & Consumers</h2>
          <p className="text-xs text-zinc-400 mb-4">
            Explore curated fine art vaults and narrative collections.
          </p>
          <Link to="/gallery" className="px-3 py-1.5 border border-zinc-700 rounded text-sm">
            Enter Gallery
          </Link>
        </div>

        <div className="border border-zinc-800 rounded-lg p-5">
          <h2 className="text-lg font-medium mb-1">Artists, Dealers, Galleries</h2>
          <p className="text-xs text-zinc-400 mb-4">
            Mint, vault, and circulate your collections inside Facinations.
          </p>
          <Link to="/studio" className="px-3 py-1.5 border border-zinc-700 rounded text-sm">
            Enter Studio
          </Link>
        </div>

        <div className="border border-zinc-800 rounded-lg p-5">
          <h2 className="text-lg font-medium mb-1">Sales Partners</h2>
          <p className="text-xs text-zinc-400 mb-4">
            Learn the story and strategy behind Facinations at the 
{/* Existing landing content above */}

<DealerIntelligencePanel />

{/* Rest of landing content below */}



Blogazine.
          </p>
          <Link to="/blogazine" className="px-3 py-1.5 border border-zinc-700 rounded text-sm">
            Visit Blogazine
          </Link>
        </div>
      </div>
    </div>
  );
}
