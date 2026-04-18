// src/pages/GeneralIntelligence.tsx
// Facinations — General Intelligence Command Center
// 12-18 month collector vault mission dashboard

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API = "http://localhost:3000";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Metric { label: string; value: string; sub?: string; delta?: string; positive?: boolean; }
interface Milestone { id: number; label: string; status: "done"|"active"|"pending"; track: "facinations"|"xervault"; eta: string; }
interface VaultPipeline { id: string; collector: string; artworks: number; estimatedAUM: number; stage: "lead"|"onboarding"|"active"|"credit_issued"; lastContact: string; }
interface ChatMessage { role: "user"|"assistant"; content: string; }

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Cinzel:wght@400;600&family=JetBrains+Mono:wght@300;400&display=swap');

  .gi-root { background:#0d0d0d; min-height:100vh; color:#e8e0d0; font-family:'Cormorant Garamond',Georgia,serif; }

  /* Top bar */
  .gi-topbar { display:flex; align-items:center; justify-content:space-between; padding:1rem 2rem; border-bottom:1px solid rgba(212,175,55,0.12); background:rgba(0,0,0,0.4); position:sticky; top:0; z-index:50; backdrop-filter:blur(8px); }
  .gi-wordmark { font-family:'Cinzel',serif; font-size:0.58rem; letter-spacing:0.4em; color:rgba(212,175,55,0.6); text-transform:uppercase; }
  .gi-title { font-family:'Cinzel',serif; font-size:0.72rem; letter-spacing:0.25em; color:rgba(212,175,55,0.9); text-transform:uppercase; }
  .gi-status { display:flex; align-items:center; gap:0.5rem; font-family:'JetBrains Mono',monospace; font-size:0.55rem; color:rgba(212,175,55,0.4); }
  .gi-dot { width:6px; height:6px; border-radius:50%; background:#4ade80; animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* Grid */
  .gi-grid { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:auto; gap:1px; background:rgba(212,175,55,0.06); }
  .gi-panel { background:#0f0f0f; padding:1.5rem; }
  .gi-panel-wide { grid-column:span 2; }
  .gi-panel-full { grid-column:span 3; }

  /* Panel header */
  .gi-panel-label { font-family:'Cinzel',serif; font-size:0.48rem; letter-spacing:0.35em; text-transform:uppercase; color:rgba(212,175,55,0.4); margin-bottom:1rem; display:flex; align-items:center; justify-content:space-between; }
  .gi-panel-label-accent { color:rgba(74,222,128,0.5); }

  /* Metrics */
  .gi-metrics { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:1rem; }
  .gi-metric { padding:1rem; background:rgba(212,175,55,0.03); border:1px solid rgba(212,175,55,0.08); border-radius:2px; }
  .gi-metric-value { font-family:'Cinzel',serif; font-size:1.4rem; color:#d4af37; font-weight:400; letter-spacing:0.05em; line-height:1; margin-bottom:0.3rem; }
  .gi-metric-label { font-size:0.65rem; color:rgba(184,176,164,0.5); letter-spacing:0.08em; text-transform:uppercase; font-family:'Cinzel',serif; }
  .gi-metric-delta { font-size:0.6rem; margin-top:0.3rem; font-family:'JetBrains Mono',monospace; }
  .gi-metric-delta.pos { color:#4ade80; }
  .gi-metric-delta.neg { color:#f87171; }

  /* Q1 target bar */
  .gi-target { margin-top:1.5rem; }
  .gi-target-label { display:flex; justify-content:space-between; font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.12em; color:rgba(212,175,55,0.5); margin-bottom:0.5rem; }
  .gi-bar { height:4px; background:rgba(212,175,55,0.08); border-radius:2px; overflow:hidden; }
  .gi-bar-fill { height:100%; background:linear-gradient(to right,#d4af37,#4ade80); border-radius:2px; transition:width 1s ease; }

  /* Pipeline */
  .gi-pipeline { display:flex; flex-direction:column; gap:0.5rem; }
  .gi-pipeline-item { display:grid; grid-template-columns:1fr auto auto auto; gap:1rem; align-items:center; padding:0.65rem 0.85rem; background:rgba(212,175,55,0.02); border:1px solid rgba(212,175,55,0.07); border-radius:2px; font-size:0.78rem; }
  .gi-collector { color:#e8e0d0; font-family:'Cinzel',serif; font-size:0.62rem; letter-spacing:0.08em; }
  .gi-aum { font-family:'JetBrains Mono',monospace; font-size:0.62rem; color:#d4af37; }
  .gi-stage { font-family:'Cinzel',serif; font-size:0.48rem; letter-spacing:0.12em; text-transform:uppercase; padding:0.2rem 0.5rem; border-radius:1px; }
  .gi-stage.lead { background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.3); color:#a5b4fc; }
  .gi-stage.onboarding { background:rgba(234,179,8,0.08); border:1px solid rgba(234,179,8,0.25); color:#fde047; }
  .gi-stage.active { background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.25); color:#4ade80; }
  .gi-stage.credit_issued { background:rgba(212,175,55,0.12); border:1px solid rgba(212,175,55,0.4); color:#d4af37; }
  .gi-last-contact { font-family:'JetBrains Mono',monospace; font-size:0.52rem; color:rgba(138,130,120,0.6); }

  /* Milestones */
  .gi-milestones { display:flex; flex-direction:column; gap:0.4rem; }
  .gi-milestone { display:grid; grid-template-columns:auto 1fr auto auto; gap:0.75rem; align-items:center; padding:0.5rem 0.75rem; border-radius:2px; }
  .gi-milestone.done { opacity:0.45; }
  .gi-milestone.active { background:rgba(212,175,55,0.04); border:1px solid rgba(212,175,55,0.12); }
  .gi-milestone.pending { opacity:0.3; }
  .gi-milestone-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
  .gi-milestone-dot.done { background:#4ade80; }
  .gi-milestone-dot.active { background:#d4af37; animation:pulse 1.5s infinite; }
  .gi-milestone-dot.pending { background:rgba(138,130,120,0.3); border:1px solid rgba(138,130,120,0.3); }
  .gi-milestone-label { font-size:0.72rem; color:#b8b0a4; }
  .gi-milestone-track { font-family:'Cinzel',serif; font-size:0.42rem; letter-spacing:0.15em; text-transform:uppercase; padding:0.15rem 0.4rem; border-radius:1px; }
  .gi-milestone-track.facinations { background:rgba(212,175,55,0.08); color:rgba(212,175,55,0.5); }
  .gi-milestone-track.xervault { background:rgba(99,102,241,0.08); color:rgba(165,180,252,0.5); }
  .gi-milestone-eta { font-family:'JetBrains Mono',monospace; font-size:0.5rem; color:rgba(138,130,120,0.5); white-space:nowrap; }

  /* Revenue */
  .gi-revenue-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
  .gi-revenue-item { padding:0.75rem; background:rgba(212,175,55,0.02); border:1px solid rgba(212,175,55,0.06); }
  .gi-revenue-amount { font-family:'JetBrains Mono',monospace; font-size:1rem; color:#d4af37; margin-bottom:0.2rem; }
  .gi-revenue-label { font-family:'Cinzel',serif; font-size:0.48rem; letter-spacing:0.12em; text-transform:uppercase; color:rgba(138,130,120,0.5); }

  /* AI Advisor */
  .gi-ai-chat { display:flex; flex-direction:column; gap:0.5rem; max-height:320px; overflow-y:auto; margin-bottom:0.75rem; }
  .gi-ai-msg { padding:0.6rem 0.85rem; border-radius:2px; font-size:0.82rem; line-height:1.6; }
  .gi-ai-msg.assistant { background:rgba(212,175,55,0.04); border:1px solid rgba(212,175,55,0.08); color:#b8b0a4; }
  .gi-ai-msg.user { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); color:#e8d89a; align-self:flex-end; max-width:85%; }
  .gi-ai-input { display:flex; gap:0.5rem; }
  .gi-ai-input input { flex:1; background:rgba(255,255,255,0.02); border:1px solid rgba(212,175,55,0.15); color:#ccc; padding:0.5rem 0.75rem; font-family:'Cormorant Garamond',serif; font-size:0.82rem; outline:none; border-radius:2px; }
  .gi-ai-btn { background:rgba(212,175,55,0.1); border:1px solid rgba(212,175,55,0.35); color:#d4af37; padding:0.5rem 1rem; font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.15em; cursor:pointer; border-radius:2px; white-space:nowrap; }
  .gi-ai-btn:disabled { opacity:0.4; cursor:not-allowed; }

  /* Quick actions */
  .gi-actions { display:flex; gap:0.5rem; flex-wrap:wrap; }
  .gi-action { background:none; border:1px solid rgba(212,175,55,0.2); color:rgba(212,175,55,0.6); font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.15em; text-transform:uppercase; padding:0.45rem 0.9rem; cursor:pointer; transition:all 0.2s; border-radius:2px; }
  .gi-action:hover { background:rgba(212,175,55,0.08); border-color:rgba(212,175,55,0.5); color:#d4af37; }
  .gi-action.green { border-color:rgba(74,222,128,0.3); color:rgba(74,222,128,0.6); }
  .gi-action.green:hover { background:rgba(74,222,128,0.08); border-color:rgba(74,222,128,0.6); color:#4ade80; }

  /* Divider */
  .gi-rule { height:1px; background:linear-gradient(to right,transparent,rgba(212,175,55,0.15),transparent); margin:1rem 0; }

  /* Scrollbar */
  .gi-ai-chat::-webkit-scrollbar { width:3px; }
  .gi-ai-chat::-webkit-scrollbar-track { background:transparent; }
  .gi-ai-chat::-webkit-scrollbar-thumb { background:rgba(212,175,55,0.2); border-radius:2px; }
`;

// ── Mock data (replace with real API calls as backend grows) ──────────────────
const MOCK_METRICS: Metric[] = [
  { label: "Total AUM", value: "$0", sub: "Target: $2–5M", delta: "Q1 2026", positive: true },
  { label: "Active Vaults", value: "0", sub: "Collector vaults", delta: "Build now →", positive: true },
  { label: "Credit Lines", value: "0", sub: "Issued to collectors", delta: "First target: $50K" },
  { label: "Protocol Fees", value: "$0", sub: "Cumulative", delta: "0.05 XER/transfer" },
];

const MOCK_PIPELINE: VaultPipeline[] = [
  { id: "1", collector: "Prospect A", artworks: 3, estimatedAUM: 280000, stage: "lead", lastContact: "Today" },
  { id: "2", collector: "Prospect B", artworks: 7, estimatedAUM: 950000, stage: "onboarding", lastContact: "2d ago" },
  { id: "3", collector: "Prospect C", artworks: 12, estimatedAUM: 2100000, stage: "active", lastContact: "1d ago" },
];

const MOCK_MILESTONES: Milestone[] = [
  { id: 1,  label: "Gallery & artwork display",             status: "done",    track: "facinations", eta: "Done" },
  { id: 2,  label: "Vault infrastructure (VaultDetail, VaultList, VaultCard)", status: "done", track: "facinations", eta: "Done" },
  { id: 3,  label: "Subscription & KYC gating",            status: "done",    track: "facinations", eta: "Done" },
  { id: 4,  label: "AI Curator + Dealer Intelligence",      status: "done",    track: "facinations", eta: "Done" },
  { id: 5,  label: "Hypsoverse immersive experience",       status: "done",    track: "facinations", eta: "Done" },
  { id: 6,  label: "General Intelligence dashboard",        status: "active",  track: "facinations", eta: "Now" },
  { id: 7,  label: "Collector vault profile (AUM + docs)",  status: "active",  track: "facinations", eta: "Q1 2026" },
  { id: 8,  label: "First collector onboarded",             status: "pending", track: "facinations", eta: "Q1 2026" },
  { id: 9,  label: "First credit line issued ($50K)",       status: "pending", track: "facinations", eta: "Q1 2026" },
  { id: 10, label: "$2M AUM milestone",                     status: "pending", track: "facinations", eta: "Q2 2026" },
  { id: 11, label: "AI advisor subscription tier",          status: "pending", track: "facinations", eta: "Q2 2026" },
  { id: 12, label: "White-label vault for first gallery",   status: "pending", track: "facinations", eta: "Q3 2026" },
  { id: 13, label: "XerVault mass market launch",           status: "pending", track: "xervault",    eta: "Q2 2026" },
  { id: 14, label: "XerVault swap fee revenue",             status: "pending", track: "xervault",    eta: "Q3 2026" },
];

const MOCK_REVENUE = [
  { label: "Vault Mgmt Fees", amount: "$0" },
  { label: "Protocol Fees",   amount: "$0" },
  { label: "AI Subscriptions",amount: "$0" },
  { label: "Credit Spread",   amount: "$0" },
];

const AI_SYSTEM = `You are the General Intelligence advisor for Facinations — a private banking infrastructure for HNW art collectors.

Your role is to keep the small founding team LASER FOCUSED on the 12-18 month mission:
- PRIMARY: Get to $2-5M AUM with at least one real credit line issued by end of Q1 2026
- WEDGE: Vault-as-credit-line for serious collectors with physical blue-chip art
- REVENUE: AUM fees → lending spread → AI advisor subscriptions (in that order)
- FEEL: Private bank infrastructure, not an app. No public listings. Invite-only.

Current build status:
- DONE: Gallery, Vaults, AI Curator, KYC/Subscription gating, Hypsoverse, General Intelligence dashboard
- ACTIVE: Collector vault profile, first collector onboarding
- PENDING: First credit line, $2M AUM, AI subscription tier, white-label

Two tracks, never conflate them:
- Facinations: HNW collectors, blue-chip art, private banking feel
- XerVault: Mass market, open marketplace, separate codebase

Be direct, strategic, and ruthlessly focused. Cut scope creep. Prioritize by revenue proximity.
Keep responses under 150 words unless asked for more.`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function GeneralIntelligence() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [chat, setChat] = useState<ChatMessage[]>([
    { role: "assistant", content: "General Intelligence online. Current priority: collector vault profile + first onboarding. You are 0% of the way to Q1 AUM target. What do you need to move today?" }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeTrack, setActiveTrack] = useState<"all"|"facinations"|"xervault">("all");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const doneCount = MOCK_MILESTONES.filter(m => m.status === "done").length;
  const totalCount = MOCK_MILESTONES.length;
  const progressPct = Math.round((doneCount / totalCount) * 100);

  const filteredMilestones = activeTrack === "all"
    ? MOCK_MILESTONES
    : MOCK_MILESTONES.filter(m => m.track === activeTrack);

  const ask = async (msg: string) => {
    if (!msg.trim() || busy) return;
    const userMsg = msg.trim();
    setInput("");
    setChat(c => [...c, { role: "user", content: userMsg }]);
    setBusy(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: AI_SYSTEM,
          messages: [...chat, { role: "user", content: userMsg }].map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const d = await res.json();
      const reply = d.content?.find((b: any) => b.type === "text")?.text ?? "No response.";
      setChat(c => [...c, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setChat(c => [...c, { role: "assistant", content: `Error: ${e.message}` }]);
    }
    setBusy(false);
  };

  const quickPrompts = [
    "What is the single most important thing to do today?",
    "What is blocking first collector onboarding?",
    "How do we reach first $50K credit line?",
    "What should we cut from scope?",
  ];

  return (
    <div className="gi-root">
      <style>{css}</style>

      {/* Top bar */}
      <div className="gi-topbar">
        <span className="gi-wordmark">Facinations · General Intelligence</span>
        <span className="gi-title">Command Center</span>
        <div className="gi-status">
          <div className="gi-dot" />
          <span>Q1 2026 · AUM Target: $2–5M</span>
        </div>
      </div>

      <div className="gi-grid">

        {/* ── Mission metrics ── */}
        <div className="gi-panel gi-panel-wide">
          <div className="gi-panel-label">
            <span>Mission Control · Q1 2026</span>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.5rem", color:"rgba(74,222,128,0.4)" }}>LIVE</span>
          </div>
          <div className="gi-metrics">
            {MOCK_METRICS.map((m, i) => (
              <div key={i} className="gi-metric">
                <div className="gi-metric-value">{m.value}</div>
                <div className="gi-metric-label">{m.label}</div>
                {m.sub && <div style={{ fontSize:"0.58rem", color:"rgba(138,130,120,0.45)", marginTop:"0.2rem" }}>{m.sub}</div>}
                {m.delta && <div className={`gi-metric-delta ${m.positive ? "pos" : "neg"}`}>{m.delta}</div>}
              </div>
            ))}
          </div>
          <div className="gi-target">
            <div className="gi-target-label">
              <span>Q1 Progress to $2M AUM</span>
              <span>{progressPct}% milestones complete</span>
            </div>
            <div className="gi-bar">
              <div className="gi-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        {/* ── Revenue ── */}
        <div className="gi-panel">
          <div className="gi-panel-label">Revenue Streams</div>
          <div className="gi-revenue-grid">
            {MOCK_REVENUE.map((r, i) => (
              <div key={i} className="gi-revenue-item">
                <div className="gi-revenue-amount">{r.amount}</div>
                <div className="gi-revenue-label">{r.label}</div>
              </div>
            ))}
          </div>
          <div className="gi-rule" />
          <div className="gi-actions">
            <button className="gi-action" onClick={() => navigate("/vaults")}>Vaults →</button>
            <button className="gi-action" onClick={() => navigate("/dashboard")}>Dashboard →</button>
            <button className="gi-action" onClick={() => navigate("/dealer-crm")}>CRM →</button>
          </div>
        </div>

        {/* ── Collector pipeline ── */}
        <div className="gi-panel gi-panel-wide">
          <div className="gi-panel-label">
            <span>Collector Vault Pipeline</span>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.5rem", color:"rgba(212,175,55,0.3)" }}>{MOCK_PIPELINE.length} prospects</span>
          </div>
          <div className="gi-pipeline">
            <div style={{ display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:"1rem", padding:"0 0.85rem 0.5rem", fontFamily:"'Cinzel',serif", fontSize:"0.44rem", letterSpacing:"0.15em", color:"rgba(138,130,120,0.4)", textTransform:"uppercase" }}>
              <span>Collector</span><span>Est. AUM</span><span>Stage</span><span>Contact</span>
            </div>
            {MOCK_PIPELINE.map(p => (
              <div key={p.id} className="gi-pipeline-item">
                <div>
                  <div className="gi-collector">{p.collector}</div>
                  <div style={{ fontSize:"0.52rem", color:"rgba(138,130,120,0.4)", marginTop:"0.15rem" }}>{p.artworks} artworks</div>
                </div>
                <div className="gi-aum">${(p.estimatedAUM/1000).toFixed(0)}K</div>
                <div className={`gi-stage ${p.stage}`}>{p.stage.replace("_"," ")}</div>
                <div className="gi-last-contact">{p.lastContact}</div>
              </div>
            ))}
            <div style={{ marginTop:"0.5rem" }}>
              <button className="gi-action green" onClick={() => navigate("/dealer-crm")}>+ Add Collector</button>
            </div>
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="gi-panel">
          <div className="gi-panel-label gi-panel-label-accent">Quick Navigation</div>
          <div className="gi-actions" style={{ flexDirection:"column", gap:"0.4rem" }}>
            {[
              ["Collector Vaults", "/vaults"],
              ["Gallery", "/gallery"],
              ["Hypsoverse", "/hypsoverse/dionysus"],
              ["AI Curator", "/curator"],
              ["Dealer CRM", "/dealer-crm"],
              ["Analytics", "/analytics"],
              ["Dashboard", "/dashboard"],
              ["Studio", "/studio"],
            ].map(([label, path]) => (
              <button key={label} className="gi-action" style={{ textAlign:"left" }} onClick={() => navigate(path)}>
                {label} →
              </button>
            ))}
          </div>
        </div>

        {/* ── AI Strategic Advisor ── */}
        <div className="gi-panel gi-panel-wide">
          <div className="gi-panel-label">
            <span>AI Strategic Advisor · Laser Focus Engine</span>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"0.5rem", color:"rgba(212,175,55,0.3)" }}>Claude Sonnet</span>
          </div>

          {/* Quick prompts */}
          <div style={{ display:"flex", gap:"0.4rem", flexWrap:"wrap", marginBottom:"0.75rem" }}>
            {quickPrompts.map((p, i) => (
              <button key={i} className="gi-action" style={{ fontSize:"0.48rem" }} onClick={() => ask(p)}>{p}</button>
            ))}
          </div>

          <div className="gi-ai-chat">
            {chat.map((m, i) => (
              <div key={i} className={`gi-ai-msg ${m.role}`}>{m.content}</div>
            ))}
            {busy && <div className="gi-ai-msg assistant" style={{ fontStyle:"italic", opacity:0.5 }}>Thinking…</div>}
            <div ref={endRef} />
          </div>

          <div className="gi-ai-input">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && ask(input)}
              placeholder="Ask the advisor anything about Facinations strategy…"
            />
            <button className="gi-ai-btn" onClick={() => ask(input)} disabled={busy}>
              {busy ? "…" : "Send →"}
            </button>
          </div>
        </div>

        {/* ── 12-18 month milestone tracker ── */}
        <div className="gi-panel gi-panel-full">
          <div className="gi-panel-label">
            <span>12–18 Month Build Tracker</span>
            <div style={{ display:"flex", gap:"0.5rem" }}>
              {(["all","facinations","xervault"] as const).map(t => (
                <button key={t} onClick={() => setActiveTrack(t)}
                  style={{ background: activeTrack===t ? "rgba(212,175,55,0.1)" : "none", border:`1px solid ${activeTrack===t ? "rgba(212,175,55,0.4)" : "rgba(212,175,55,0.1)"}`, color: activeTrack===t ? "#d4af37" : "rgba(138,130,120,0.4)", fontFamily:"'Cinzel',serif", fontSize:"0.44rem", letterSpacing:"0.15em", textTransform:"uppercase", padding:"0.2rem 0.6rem", cursor:"pointer", borderRadius:"1px" }}>
                  {t === "all" ? "All" : t === "facinations" ? "Facinations" : "XerVault"}
                </button>
              ))}
            </div>
          </div>
          <div className="gi-milestones">
            {filteredMilestones.map(m => (
              <div key={m.id} className={`gi-milestone ${m.status}`}>
                <div className={`gi-milestone-dot ${m.status}`} />
                <div className="gi-milestone-label">{m.label}</div>
                <div className={`gi-milestone-track ${m.track}`}>{m.track}</div>
                <div className="gi-milestone-eta">{m.eta}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
