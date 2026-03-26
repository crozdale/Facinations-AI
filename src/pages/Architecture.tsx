import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMeta } from "../hooks/useMeta";

const sections = [
  { id: "overview", title: "How Data Flows", content: [
    { heading: "Overview", body: "All user interactions across ARTxDALE, xdalegallery, XER Wallet, and Swapp flow through a unified data architecture — vault lists, positions, provenance, swap state, gallery views, and teleport history all originate from the Subgraph." },
    { heading: "Architecture Layers", code: "[ UX Layer ]      ARTxDALE | xdalegallery | XER Wallet | Swapp\n                         ↓\n[ Data Access ]   Subgraph (GraphQL)\n                         ↓\n[ Chain Access ]  Chainstack RPC\n                         ↓\n[ On-Chain ]      Smart Contracts (Vaults, Swaps, Teleport, Facinations)\n                         ↓\n[ Off-Chain ]     Backend (notifications, jobs, aggregations)\n                         ↓\n[ Engagement ]    Email / Discord / Telegram / In-app" }
  ]},
  { id: "pipelines", title: "Pipelines", content: [
    { heading: "Read Pipeline", code: "App → Subgraph → Chainstack → Contracts → Subgraph → App" },
    { heading: "Write Pipeline", code: "App → Wallet → Chainstack → Contracts → Events → Subgraph → App" },
    { heading: "Notification Pipeline", code: "Contracts → Events → Subgraph → Backend → Channels" },
  ]},
  { id: "vault-flow", title: "Flow 1: Create Vault", content: [
    { heading: "Step 1 — User creates vault", body: "Studio prepares the vault creation transaction, sends to wallet, which signs and broadcasts to Chainstack RPC." },
    { heading: "Step 2 — Contract emits events", body: "VaultFactory executes createVault(), emitting VaultCreated and PositionUpdated events." },
    { heading: "Step 3 — Subgraph indexes", body: "Subgraph detects VaultCreated and updates Vault, UserPosition, and ProvenanceEvent entities." },
    { heading: "Steps 4–6 — Backend, Gallery, Wallet", body: "Backend sends notifications. xdalegallery renders the new vault. XER Wallet shows the new position." },
    { heading: "Compact Pipeline", code: "[Studio UI] → [Wallet] → [Chainstack RPC] → [Contracts]\n→ [Subgraph] → [Backend] → [xdalegallery] → [XER Wallet]" },
  ]},
  { id: "fraction-flow", title: "Flow 2: Fractionalize", content: [
    { heading: "Step 1 — Initiation", body: "Studio fetches asset data from Subgraph, verifies on-chain state via Chainstack, prepares fractionalization transaction." },
    { heading: "Step 2 — Contract executes", body: "Contract locks the original NFT, mints fractional tokens (ERC1155/ERC20), emits AssetLocked, Fractionalized, and ProvenanceEvent." },
    { heading: "Compact Pipeline", code: "[Studio UI] → [Wallet] → [Chainstack] → [Contracts]\n→ (AssetLocked + Fractionalized + ProvenanceEvent)\n→ [Subgraph] → [Backend] → [All Apps]" },
  ]},
  { id: "swap-flow", title: "Flow 3: Swap for XER", content: [
    { heading: "Step 1 — Initiation in Swapp", body: "Swapp fetches token data and pool state from Subgraph, verifies balances via Chainstack, prepares swap transaction." },
    { heading: "Step 2 — Contract executes", body: "Validates balances, liquidity, pricing curve. Transfers fractional tokens to pool, XER to user. Emits SwapExecuted and ProvenanceEvent." },
    { heading: "Compact Pipeline", code: "[Swapp UI] → [Wallet] → [Chainstack] → [Contracts]\n→ (SwapExecuted + Transfers + ProvenanceEvent)\n→ [Subgraph] → [Backend] → [All Apps]" },
  ]},
  { id: "teleport-flow", title: "Flow 4: Teleport", content: [
    { heading: "Step 1 — Initiation", body: "Teleport UI fetches asset metadata, location, and history from Subgraph. Verifies approvals via Chainstack." },
    { heading: "Step 2 — Contract executes", body: "Validates ownership and destination. Updates asset location. Emits Teleported and ProvenanceEvent." },
    { heading: "Compact Pipeline", code: "[Teleport UI] → [Wallet] → [Chainstack] → [Contracts]\n→ (Teleported + ProvenanceEvent)\n→ [Subgraph] → [Backend] → [All Apps]" },
  ]},
  { id: "etl", title: "ETL — Analytics", content: [
    { heading: "What is ETL?", body: "Extract, Transform, Load. The optional layer where Subgraph data is moved into a database or analytics warehouse for heavy aggregations, dashboards, CRM scoring, and historical reporting." },
    { heading: "ETL Pipeline", code: "[Subgraph] → (Extract) → [ETL Pipeline]\n→ (Transform) → [Analytics DB]\n→ (Load) → [Studio Dashboards / CRM]" },
  ]},
  { id: "lifecycle", title: "Vault Lifecycle", content: [
    { heading: "Step 1 — Register", body: "Artist creates a Vault Record — not a listing. Public read-only. Behaves like a catalogue raisonné entry." },
    { heading: "Step 2 — Whole Acquisition Mode", body: "Vault configured for single-unit acquisition. Fractionalization optional, enabled later." },
    { heading: "Step 3 — Collector A Acquires", body: "Single ownership unit minted. Vault status: Owned. No secondary market enabled." },
    { heading: "Step 4 — Fractionalization", body: "Collector A enables fractionalization with defined legal terms. E.g. 100 fractions, explicit rights." },
    { heading: "Step 5 — Collector B Acquires Fraction", body: "Collector B acquires fractions (e.g. 10/100). Physical artwork stays in same custody." },
    { heading: "Step 6 — Barter Mode", body: "Fraction ↔ fraction or fraction ↔ crypto under vault rules. No open order book needed." },
    { heading: "Step 7 — Forward Participation", body: "Artist defines rights tied to future works or milestones. Structured, not speculative." },
  ]},
];

export default function Architecture() {
  const { t } = useTranslation();
  useMeta({
    title: t("architecture.eyebrow"),
    description: "Technical documentation for the Facinations protocol — subgraph data flow, smart contracts, ETL pipeline, and swap mechanics.",
  });
  const [active, setActive] = useState("overview");
  const current = sections.find(s => s.id === active);
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080808", color: "#e8e0d0", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Cinzel:wght@400;600&display=swap');`}</style>
      <nav style={{ width: 220, borderRight: "1px solid rgba(212,175,55,0.1)", padding: "2.5rem 0", flexShrink: 0, background: "#060606" }}>
        <p style={{ color: "#d4af37", fontFamily: "'Cinzel', serif", fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", padding: "0 1.25rem", marginBottom: "1.5rem" }}>{t("architecture.eyebrow")}</p>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "0.6rem 1.25rem", background: active === s.id ? "rgba(212,175,55,0.06)" : "transparent", border: "none", borderLeft: active === s.id ? "2px solid #d4af37" : "2px solid transparent", color: active === s.id ? "#d4af37" : "#444", cursor: "pointer", fontFamily: "'Cinzel', serif", fontSize: "0.62rem", letterSpacing: "0.08em", transition: "all 0.2s" }}>
            {s.title}
          </button>
        ))}
      </nav>
      <main style={{ flex: 1, padding: "3.5rem", maxWidth: 780, overflowY: "auto" }}>
        <h1 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", fontSize: "clamp(1.2rem,2.5vw,1.8rem)", fontWeight: 400, letterSpacing: "0.1em", marginBottom: "2rem", borderBottom: "1px solid rgba(212,175,55,0.1)", paddingBottom: "1rem" }}>{current.title}</h1>
        {current.content.map((block, i) => (
          <div key={i} style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", color: "#a09080", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.6rem" }}>{block.heading}</h2>
            {block.body && <p style={{ color: "#8a8278", lineHeight: 1.9, fontSize: "0.98rem" }}>{block.body}</p>}
            {block.code && <pre style={{ background: "#0c0c0c", border: "1px solid rgba(212,175,55,0.12)", padding: "1.2rem", fontSize: "0.78rem", color: "#d4af37", overflowX: "auto", fontFamily: "monospace", lineHeight: 1.7, marginTop: "0.5rem" }}>{block.code}</pre>}
          </div>
        ))}
      </main>
    </div>
  );
}
