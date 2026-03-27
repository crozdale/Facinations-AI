// src/components/AICurator.tsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { streamClaude } from "../utils/askClaude";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  context?: string;
}

const css = `
  .sia-btn { display:flex; align-items:center; gap:0.5rem; padding:0.4rem 1rem; border:1px solid rgba(212,175,55,0.4); background:none; color:#d4af37; font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; transition:background 0.2s; }
  .sia-btn:hover { background:rgba(212,175,55,0.08); }
  .sia-panel { position:absolute; right:0; top:calc(100% + 0.5rem); width:320px; border:1px solid rgba(212,175,55,0.2); background:#1c1c1c; box-shadow:0 8px 40px rgba(0,0,0,0.8); z-index:50; }
  .sia-panel-header { display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; border-bottom:1px solid rgba(212,175,55,0.1); }
  .sia-panel-title { font-family:'Cinzel',serif; font-size:0.75rem; color:#f8f2e4; letter-spacing:0.12em; }
  .sia-close { background:none; border:none; color:#8a8278; cursor:pointer; font-size:1rem; line-height:1; padding:0; }
  .sia-close:hover { color:#d4af37; }
  .sia-messages { height:220px; overflow-y:auto; padding:0.75rem 1rem; display:flex; flex-direction:column; gap:0.5rem; }
  .sia-msg { max-width:90%; padding:0.5rem 0.75rem; font-size:0.82rem; line-height:1.6; font-family:'Cormorant Garamond',serif; }
  .sia-msg-user { align-self:flex-end; background:rgba(212,175,55,0.12); color:#f2ece0; border:1px solid rgba(212,175,55,0.2); }
  .sia-msg-assistant { align-self:flex-start; background:#242424; color:#b8b0a4; font-style:italic; border:1px solid rgba(212,175,55,0.06); }
  .sia-cursor { display:inline-block; width:2px; height:0.85em; background:rgba(212,175,55,0.5); margin-left:2px; vertical-align:middle; animation:sia-blink 0.7s infinite; }
  @keyframes sia-blink { 0%,100%{opacity:1} 50%{opacity:0} }
  .sia-input-row { display:flex; gap:0.5rem; padding:0.75rem 1rem; border-top:1px solid rgba(212,175,55,0.1); }
  .sia-input { flex:1; background:#242424; border:1px solid rgba(212,175,55,0.15); color:#f2ece0; font-family:'Cormorant Garamond',serif; font-size:0.85rem; padding:0.4rem 0.6rem; }
  .sia-input:focus { outline:none; border-color:rgba(212,175,55,0.4); }
  .sia-input::placeholder { color:#333; }
  .sia-send { background:#d4af37; border:none; color:#141414; font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.15em; padding:0 0.75rem; cursor:pointer; }
  .sia-send:disabled { background:#333; color:#666; cursor:not-allowed; }
`;

export default function AICurator({ context = "" }: Props) {
  const { t } = useTranslation();
  const storageKey = `sia_msgs_${context || "default"}`;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [{ role: "assistant", content: t("aiCurator.greeting") }];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { sessionStorage.setItem(storageKey, JSON.stringify(messages)); } catch {}
  }, [messages, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");

    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    setMessages((m) => [
      ...m,
      { role: "user", content: msg },
      { role: "assistant", content: "" },
    ]);
    setLoading(true);

    const systemPrompt = `You are SIA — the Synthetic Intelligence Analyst and principal curator at Musée-Crosdale, a luxury fine-art institution built on the Facinations protocol. You have deep expertise in art history, aesthetics, on-chain provenance, fractional ownership, XER token economics, and collector strategy.${context ? `\n\nCurrent context: ${context}` : ""}

Respond as SIA — elegant, precise, slightly poetic. Under 3 sentences unless the visitor asks for more. Speak as if narrating a private view at a world-class gallery. Never fabricate auction results or valuations.`;

    try {
      await streamClaude(
        {
          model: "claude-sonnet-4-6",
          max_tokens: 450,
          system: systemPrompt,
          messages: [...history, { role: "user", content: msg }],
        },
        (chunk) => {
          setMessages((m) => {
            const updated = [...m];
            updated[updated.length - 1] = {
              role: "assistant",
              content: updated[updated.length - 1].content + chunk,
            };
            return updated;
          });
        }
      );
    } catch {
      setMessages((m) => {
        const updated = [...m];
        updated[updated.length - 1] = { role: "assistant", content: t("aiCurator.error") };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <style>{css}</style>
      <button className="sia-btn" onClick={() => setOpen((o) => !o)}>
        ✦ SIA · Curator {open ? "▲" : "▼"}
      </button>

      {open && (
        <div className="sia-panel">
          <div className="sia-panel-header">
            <span className="sia-panel-title">{t("aiCurator.panel_title")}</span>
            <button className="sia-close" onClick={() => setOpen(false)}>×</button>
          </div>

          <div className="sia-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`sia-msg ${m.role === "user" ? "sia-msg-user" : "sia-msg-assistant"}`}
              >
                {m.content}
                {loading && i === messages.length - 1 && m.role === "assistant" && (
                  <span className="sia-cursor" />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="sia-input-row">
            <input
              className="sia-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t("aiCurator.placeholder")}
            />
            <button className="sia-send" onClick={send} disabled={!input.trim() || loading}>
              {t("aiCurator.btn_send")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
