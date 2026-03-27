// src/components/MistralWidget.tsx
// Context-aware SIA floating widget — routes through /api/claude (no exposed keys).
import React, { useState, useRef, useEffect } from "react";
import { streamClaude } from "../utils/askClaude";

type Context = "gallery" | "studio" | "vaults";

interface Props {
  context?: Context;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPTS: Record<Context, string> = {
  gallery: `You are SIA — the Synthetic Intelligence Analyst at Musée-Crosdale, a luxury fine-art institution built on the Facinations protocol. You are the gallery's AI curator. Help visitors understand artworks, artists, cultural significance, provenance, and collecting strategy. Be insightful, elegant, and concise — under 4 sentences unless asked to expand. Never fabricate specific auction results or valuations. Speak as if narrating a private view.`,
  studio: `You are SIA — the Synthetic Intelligence Analyst at Musée-Crosdale's Facinations Studio. Help artists and collectors understand the minting process, vault creation, ERC-721 and ERC-1155 standards, IPFS metadata, on-chain provenance, fractional ownership, and studio subscription tiers. Be practical and precise. Under 4 sentences unless asked to expand.`,
  vaults: `You are SIA — the Synthetic Intelligence Analyst at Musée-Crosdale's Facinations Vault platform. Help users understand fractional vault ownership, XER token economics, the Swapp AMM, reserve pricing, governance, and collector strategy. Never give financial advice; give directional guidance only. Under 4 sentences unless asked to expand.`,
};

const LABELS: Record<Context, string> = {
  gallery: "Art Analyst",
  studio: "Studio Assistant",
  vaults: "Vault Advisor",
};

const PLACEHOLDERS: Record<Context, string> = {
  gallery: "Ask about this artwork or artist…",
  studio: "Ask about minting, vaults, IPFS…",
  vaults: "Ask about fractions, XER, strategy…",
};

const css = `
  .mw-fab { position:fixed; bottom:2rem; right:2rem; z-index:1000; width:52px; height:52px; border:1px solid rgba(212,175,55,0.4); background:#080808; color:#d4af37; font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.1em; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 32px rgba(0,0,0,0.8); transition:border-color 0.2s; }
  .mw-fab:hover { border-color:#d4af37; background:rgba(212,175,55,0.05); }
  .mw-panel { position:fixed; bottom:5.5rem; right:2rem; z-index:1000; width:340px; max-height:500px; background:#080808; border:1px solid rgba(212,175,55,0.2); display:flex; flex-direction:column; box-shadow:0 8px 48px rgba(0,0,0,0.85); overflow:hidden; }
  .mw-header { padding:0.85rem 1rem; border-bottom:1px solid rgba(212,175,55,0.1); display:flex; align-items:center; gap:0.65rem; }
  .mw-dot { width:6px; height:6px; background:#d4af37; flex-shrink:0; }
  .mw-title { font-family:'Cinzel',serif; font-size:0.7rem; letter-spacing:0.12em; color:#f0e8d0; }
  .mw-sub { font-family:'Cormorant Garamond',serif; font-size:0.75rem; color:#6a6258; font-style:italic; }
  .mw-online { margin-left:auto; width:6px; height:6px; background:rgba(92,184,92,0.8); border-radius:50%; flex-shrink:0; }
  .mw-messages { flex:1; overflow-y:auto; padding:1rem; display:flex; flex-direction:column; gap:0.65rem; min-height:180px; }
  .mw-empty { font-family:'Cormorant Garamond',serif; font-size:0.85rem; color:#4a4238; font-style:italic; text-align:center; margin:auto; }
  .mw-bubble { max-width:88%; padding:0.55rem 0.8rem; font-family:'Cormorant Garamond',serif; font-size:0.85rem; line-height:1.65; }
  .mw-bubble-user { align-self:flex-end; background:rgba(212,175,55,0.08); border:1px solid rgba(212,175,55,0.2); color:#e8e0d0; }
  .mw-bubble-ai { align-self:flex-start; background:rgba(255,255,255,0.02); border:1px solid rgba(212,175,55,0.06); color:#9a9288; font-style:italic; }
  .mw-cursor { display:inline-block; width:2px; height:0.85em; background:rgba(212,175,55,0.5); margin-left:2px; vertical-align:middle; animation:mw-blink 0.7s infinite; }
  @keyframes mw-blink { 0%,100%{opacity:1} 50%{opacity:0} }
  .mw-input-row { border-top:1px solid rgba(212,175,55,0.1); padding:0.6rem 0.75rem; display:flex; gap:0.5rem; background:#050505; }
  .mw-input { flex:1; background:transparent; border:none; outline:none; font-family:'Cormorant Garamond',serif; font-size:0.88rem; color:#e8e0d0; }
  .mw-input::placeholder { color:#2a2a2a; }
  .mw-send { background:none; border:none; font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.15em; text-transform:uppercase; color:#d4af37; cursor:pointer; padding:0.25rem 0.5rem; }
  .mw-send:disabled { color:#2a2a2a; cursor:not-allowed; }
`;

export default function MistralWidget({ context = "gallery" }: Props) {
  const ctx = context as Context;
  const storageKey = `mw_msgs_${ctx}`;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { sessionStorage.setItem(storageKey, JSON.stringify(messages)); } catch {}
  }, [messages, storageKey]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");

    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [
      ...prev,
      { role: "user", content: msg },
      { role: "assistant", content: "" },
    ]);
    setLoading(true);

    try {
      await streamClaude(
        {
          model: "claude-sonnet-4-6",
          max_tokens: 350,
          system: SYSTEM_PROMPTS[ctx],
          messages: [...history, { role: "user", content: msg }],
        },
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: updated[updated.length - 1].content + chunk,
            };
            return updated;
          });
        }
      );
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Unable to reach SIA. Please try again.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{css}</style>

      <button
        className="mw-fab"
        onClick={() => setOpen((o) => !o)}
        title={`Ask SIA — ${LABELS[ctx]}`}
      >
        {open ? "✕" : "SIA"}
      </button>

      {open && (
        <div className="mw-panel">
          <div className="mw-header">
            <div className="mw-dot" />
            <div>
              <div className="mw-title">SIA · Facinations</div>
              <div className="mw-sub">{LABELS[ctx]}</div>
            </div>
            <div className="mw-online" title="Online" />
          </div>

          <div className="mw-messages">
            {messages.length === 0 && (
              <p className="mw-empty">{PLACEHOLDERS[ctx]}</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`mw-bubble ${m.role === "user" ? "mw-bubble-user" : "mw-bubble-ai"}`}>
                {m.content}
                {loading && i === messages.length - 1 && m.role === "assistant" && (
                  <span className="mw-cursor" />
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="mw-input-row">
            <input
              className="mw-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask SIA…"
            />
            <button className="mw-send" onClick={send} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
