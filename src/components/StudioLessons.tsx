// src/components/StudioLessons.tsx
// AI-powered lesson flows for Facinations Studio.
// Each lesson has structured content + an embedded AI tutor scoped to that topic.

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

// ── Claude helper ─────────────────────────────────────────────────────────────
async function askClaude(
  systemPrompt: string,
  userMsg: string,
  history: { role: string; content: string }[] = []
): Promise<string> {
  const res = await fetch("/api/claude/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      system: systemPrompt,
      messages: [...history, { role: "user", content: userMsg }],
    }),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw}`);
  const d = JSON.parse(raw);
  return d.content?.find((b: any) => b.type === "text")?.text ?? "No response.";
}

// ── Lesson definitions ────────────────────────────────────────────────────────
interface Lesson {
  id: string;
  module: number;
  title: string;
  duration: string;
  intro: string;
  concepts: string[];
  systemPrompt: string;
  starterQuestion: string;
}

const LESSONS: Lesson[] = [
  {
    id: "provenance",
    module: 1,
    title: "On-Chain Provenance",
    duration: "~8 min",
    intro:
      "Provenance — the documented history of an artwork's ownership — has always determined value in the art market. Blockchain makes provenance immutable and publicly verifiable for the first time. This lesson covers how ERC721 and ERC1155 tokens embed ownership history directly into the protocol layer.",
    concepts: ["ERC721", "Immutable records", "Chain-of-custody", "Metadata URI"],
    systemPrompt:
      "You are a Studio tutor at Facinations, teaching an artist or collector about on-chain provenance. Explain how blockchain replaces traditional certificate of authenticity systems, how ERC721 token IDs map to individual works, and how IPFS/Arweave metadata URIs make records permanent. Be clear, practical, and encouraging. Under 4 sentences per reply unless the student asks for more depth. Use examples from the Facinations protocol where relevant.",
    starterQuestion: "What is on-chain provenance, and why does it matter for my artwork?",
  },
  {
    id: "fractionalization",
    module: 2,
    title: "Art Fractionalization",
    duration: "~10 min",
    intro:
      "Fractionalization converts a single high-value artwork into many tradeable ERC1155 fraction tokens — lowering the entry point for collectors and creating liquidity for artists. This lesson walks through how the FractionalVault contract locks an ERC721, mints fraction tokens, and how those tokens are priced and traded.",
    concepts: ["ERC1155", "FractionalVault", "Fraction tokens", "Liquidity"],
    systemPrompt:
      "You are a Studio tutor at Facinations, teaching about art fractionalization. Cover how ERC1155 tokens differ from ERC721, how the FractionalVault locks a parent NFT and mints fractions, how fraction prices reflect artwork value, and the trade-offs (liquidity vs. full ownership). Be technically accurate but accessible. Use the Facinations Albatrix I vault as a worked example when helpful.",
    starterQuestion: "How does splitting an artwork into fraction tokens actually work?",
  },
  {
    id: "xer",
    module: 3,
    title: "The XER Token",
    duration: "~7 min",
    intro:
      "XER is the utility token of the Facinations protocol — used to pay swap fees, unlock premium vault access, and participate in governance. This lesson explains the XER tokenomics, the 0.3% fee model, how the constant-product AMM (x·y=k) prices XER, and why holding XER grants platform benefits.",
    concepts: ["XER tokenomics", "AMM pricing", "0.3% swap fee", "Premium access"],
    systemPrompt:
      "You are a Studio tutor at Facinations, teaching about the XER token. Explain XER's role in the protocol: swap fees (0.3%), premium vault access (XERPremiumGate contract), AMM constant-product pricing (x*y=k), and governance. Help students understand the value accrual mechanism — fees collected in XER flow back to stakers. Be concise and use simple maths if illustrating AMM pricing.",
    starterQuestion: "What is XER and why do I need it to use the platform?",
  },
  {
    id: "pricing",
    module: 4,
    title: "Pricing Art On-Chain",
    duration: "~12 min",
    intro:
      "How is a digitised artwork valued? This lesson covers the key metrics shown on vault cards — APY, TVL, risk score, and volatility — and explains where they come from. You'll also learn how options pricing models (Black-Scholes) and AMM depth curves inform on-chain art valuations.",
    concepts: ["APY", "TVL", "Risk score", "Black-Scholes basics"],
    systemPrompt:
      "You are a Studio tutor at Facinations, teaching how on-chain artworks are valued. Cover: APY as annualised yield from trade fees, TVL as total XER locked in a vault, risk scores derived from volatility of trades and artwork category, and a simplified Black-Scholes intuition (time value, volatility, underlying price). Avoid jargon overload — relate everything back to practical vault selection decisions for an art collector.",
    starterQuestion: "What does the APY on a vault actually represent?",
  },
  {
    id: "collector-strategy",
    module: 5,
    title: "Collector Strategy",
    duration: "~10 min",
    intro:
      "Building a portfolio of on-chain art positions requires balancing risk, liquidity, and artistic conviction. This lesson covers how to evaluate vault metrics, diversify across risk tiers, understand exit liquidity, and use the Facinations Swapp barter system to rebalance without touching fiat.",
    concepts: ["Portfolio diversification", "Risk tiers", "Exit liquidity", "Barter swaps"],
    systemPrompt:
      "You are a Studio tutor at Facinations, coaching a collector on portfolio strategy for on-chain art. Cover: balancing Low/Medium/High risk vaults, evaluating TVL as a liquidity proxy, using Swapp for position rebalancing, holding XER as a hedge against platform fee exposure, and the importance of provenance quality when choosing which vault fractions to hold. Be strategic and concrete, like a seasoned art advisor.",
    starterQuestion: "How should I build a balanced portfolio of vault positions?",
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LessonState {
  open: boolean;
  completed: boolean;
  messages: Message[];
  input: string;
  loading: boolean;
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  .sl-root { max-width:860px; margin:0 auto; padding:0 1rem; }
  .sl-section-title { font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.35em; text-transform:uppercase; color:#d4af37; margin:0 0 0.5rem; }
  .sl-heading { font-family:'Cinzel',serif; font-size:1.1rem; font-weight:400; color:#f0e8d0; letter-spacing:0.08em; margin:0 0 2rem; }
  .sl-card { border:1px solid rgba(212,175,55,0.15); background:#0a0a0a; margin-bottom:1px; transition:border-color 0.2s; }
  .sl-card.completed { border-color:rgba(92,184,92,0.25); }
  .sl-card-header { display:flex; align-items:center; gap:1rem; padding:1.25rem 1.5rem; cursor:pointer; }
  .sl-card-header:hover .sl-card-title { color:#d4af37; }
  .sl-module-num { font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.2em; color:#4a4238; min-width:60px; }
  .sl-card-meta { flex:1; }
  .sl-card-title { font-family:'Cinzel',serif; font-size:0.9rem; color:#c8c0b0; letter-spacing:0.08em; margin:0 0 0.25rem; transition:color 0.2s; }
  .sl-card-dur { font-size:0.72rem; color:#4a4238; font-style:italic; }
  .sl-card-status { font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.15em; text-transform:uppercase; }
  .sl-card-status.done { color:#5cb85c; }
  .sl-card-status.todo { color:#333; }
  .sl-chevron { color:#4a4238; font-size:0.8rem; transition:transform 0.2s; }
  .sl-chevron.open { transform:rotate(180deg); }
  .sl-card-body { padding:0 1.5rem 1.5rem; border-top:1px solid rgba(212,175,55,0.08); }
  .sl-intro { font-family:'Cormorant Garamond',serif; font-size:0.95rem; color:#8a8278; line-height:1.8; margin:1rem 0; font-style:italic; }
  .sl-concepts { display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.25rem; }
  .sl-concept { font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.15em; text-transform:uppercase; color:rgba(212,175,55,0.7); border:1px solid rgba(212,175,55,0.2); padding:0.2rem 0.6rem; }
  .sl-begin-btn { padding:0.55rem 1.5rem; background:#d4af37; border:none; color:#050505; font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; }
  .sl-begin-btn:hover { background:#c09f27; }
  .sl-done-btn { padding:0.55rem 1.5rem; background:transparent; border:1px solid rgba(92,184,92,0.3); color:#5cb85c; font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; margin-left:0.75rem; }
  .sl-done-btn:hover { background:rgba(92,184,92,0.06); }
  .sl-tutor { margin-top:1.25rem; border:1px solid rgba(212,175,55,0.12); background:#060606; }
  .sl-tutor-header { display:flex; align-items:center; justify-content:space-between; padding:0.6rem 1rem; border-bottom:1px solid rgba(212,175,55,0.08); }
  .sl-tutor-label { font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.2em; color:#6a6258; }
  .sl-messages { height:240px; overflow-y:auto; padding:0.75rem 1rem; display:flex; flex-direction:column; gap:0.5rem; }
  .sl-msg { max-width:88%; padding:0.5rem 0.75rem; font-family:'Cormorant Garamond',serif; font-size:0.88rem; line-height:1.65; }
  .sl-msg-user { align-self:flex-end; background:rgba(212,175,55,0.1); color:#e8e0d0; border:1px solid rgba(212,175,55,0.18); }
  .sl-msg-ai { align-self:flex-start; background:#0c0c0c; color:#9a9288; font-style:italic; border:1px solid rgba(212,175,55,0.06); }
  .sl-typing { font-size:0.78rem; color:rgba(212,175,55,0.35); font-style:italic; font-family:'Cormorant Garamond',serif; padding:0.25rem 0; align-self:flex-start; }
  .sl-input-row { display:flex; gap:0; border-top:1px solid rgba(212,175,55,0.08); }
  .sl-input { flex:1; background:#060606; border:none; border-right:1px solid rgba(212,175,55,0.1); color:#e8e0d0; font-family:'Cormorant Garamond',serif; font-size:0.88rem; padding:0.6rem 0.85rem; }
  .sl-input:focus { outline:none; }
  .sl-input::placeholder { color:#2a2a2a; }
  .sl-send { background:#d4af37; border:none; color:#050505; font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.15em; padding:0 1rem; cursor:pointer; white-space:nowrap; }
  .sl-send:disabled { background:#222; color:#444; cursor:not-allowed; }
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function StudioLessons() {
  const { t } = useTranslation();
  const [states, setStates] = useState<Record<string, LessonState>>(() =>
    Object.fromEntries(
      LESSONS.map((l) => [
        l.id,
        {
          open: false,
          completed: false,
          messages: [
            {
              role: "assistant",
              content: l.starterQuestion
                ? t("studioLessons.welcome_starter", { module: l.module, title: l.title, starter: l.starterQuestion })
                : t("studioLessons.welcome_default", { module: l.module, title: l.title }),
            },
          ],
          input: "",
          loading: false,
        },
      ])
    )
  );

  const endRefs = useRef<Record<string, HTMLDivElement | null>>({});

  function patch(id: string, update: Partial<LessonState>) {
    setStates((s) => ({ ...s, [id]: { ...s[id], ...update } }));
  }

  function toggleOpen(id: string) {
    patch(id, { open: !states[id].open });
  }

  function markComplete(id: string) {
    patch(id, { completed: true });
  }

  useEffect(() => {
    LESSONS.forEach((l) => {
      endRefs.current[l.id]?.scrollIntoView({ behavior: "smooth" });
    });
  }, [states]);

  async function send(lesson: Lesson) {
    const st = states[lesson.id];
    const msg = st.input.trim();
    if (!msg || st.loading) return;

    const updated: Message[] = [...st.messages, { role: "user", content: msg }];
    patch(lesson.id, { messages: updated, input: "", loading: true });

    const history = st.messages.map((m) => ({ role: m.role, content: m.content }));

    try {
      const reply = await askClaude(lesson.systemPrompt, msg, history);
      setStates((s) => ({
        ...s,
        [lesson.id]: {
          ...s[lesson.id],
          messages: [...s[lesson.id].messages.filter((_, i) => i < updated.length), { role: "assistant", content: reply }],
          loading: false,
        },
      }));
    } catch {
      setStates((s) => ({
        ...s,
        [lesson.id]: {
          ...s[lesson.id],
          messages: [
            ...s[lesson.id].messages,
            { role: "assistant", content: t("studioLessons.tutor_error") },
          ],
          loading: false,
        },
      }));
    }
  }

  const completed = LESSONS.filter((l) => states[l.id].completed).length;

  return (
    <div className="sl-root">
      <style>{css}</style>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "2rem" }}>
        <div>
          <p className="sl-section-title">{t("studioLessons.section_title")}</p>
          <h2 className="sl-heading">{t("studioLessons.heading")}</h2>
        </div>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.15em", color: completed === LESSONS.length ? "#5cb85c" : "#4a4238" }}>
          {t("studioLessons.progress", { completed, total: LESSONS.length })}
        </span>
      </div>

      {LESSONS.map((lesson) => {
        const st = states[lesson.id];
        return (
          <div key={lesson.id} className={`sl-card${st.completed ? " completed" : ""}`}>
            {/* Header row — click to expand */}
            <div className="sl-card-header" onClick={() => toggleOpen(lesson.id)}>
              <span className="sl-module-num">{t("studioLessons.module", { num: lesson.module })}</span>
              <div className="sl-card-meta">
                <p className="sl-card-title">{lesson.title}</p>
                <p className="sl-card-dur">{lesson.duration}</p>
              </div>
              <span className={`sl-card-status ${st.completed ? "done" : "todo"}`}>
                {st.completed ? t("studioLessons.status_done") : "—"}
              </span>
              <span className={`sl-chevron${st.open ? " open" : ""}`}>▾</span>
            </div>

            {/* Expandable body */}
            {st.open && (
              <div className="sl-card-body">
                <p className="sl-intro">{lesson.intro}</p>

                {/* Concept pills */}
                <div className="sl-concepts">
                  {lesson.concepts.map((c) => (
                    <span key={c} className="sl-concept">{c}</span>
                  ))}
                </div>

                {/* CTA row */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button className="sl-begin-btn" onClick={() => {}}>
                    {st.messages.length > 1 ? t("studioLessons.btn_continue") : t("studioLessons.btn_begin")}
                  </button>
                  {!st.completed && (
                    <button className="sl-done-btn" onClick={() => markComplete(lesson.id)}>
                      {t("studioLessons.btn_mark_complete")}
                    </button>
                  )}
                </div>

                {/* AI Tutor panel */}
                <div className="sl-tutor">
                  <div className="sl-tutor-header">
                    <span className="sl-tutor-label">{t("studioLessons.tutor_label")} · {lesson.title}</span>
                  </div>

                  <div className="sl-messages">
                    {st.messages.map((m, i) => (
                      <div
                        key={i}
                        className={`sl-msg ${m.role === "user" ? "sl-msg-user" : "sl-msg-ai"}`}
                      >
                        {m.content}
                      </div>
                    ))}
                    {st.loading && <div className="sl-typing">{t("studioLessons.tutor_thinking")}</div>}
                    <div ref={(el) => { endRefs.current[lesson.id] = el; }} />
                  </div>

                  <div className="sl-input-row">
                    <input
                      className="sl-input"
                      type="text"
                      value={st.input}
                      onChange={(e) => patch(lesson.id, { input: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && send(lesson)}
                      placeholder={t("studioLessons.placeholder_ask", { topic: lesson.title.toLowerCase() })}
                    />
                    <button
                      className="sl-send"
                      onClick={() => send(lesson)}
                      disabled={!st.input.trim() || st.loading}
                    >
                      {t("studioLessons.btn_send")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
