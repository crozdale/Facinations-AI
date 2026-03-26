// src/components/AICurator.tsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  context?: string;
}

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
      max_tokens: 400,
      system: systemPrompt,
      messages: [...history, { role: "user", content: userMsg }],
    }),
  });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${raw}`);
  const d = JSON.parse(raw);
  return d.content?.find((b: any) => b.type === "text")?.text ?? "No response.";
}

const css = `
  .sia-btn { display:flex; align-items:center; gap:0.5rem; padding:0.4rem 1rem; border:1px solid rgba(212,175,55,0.4); background:none; color:#d4af37; font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; transition:background 0.2s; }
  .sia-btn:hover { background:rgba(212,175,55,0.08); }
  .sia-panel { position:absolute; right:0; top:calc(100% + 0.5rem); width:320px; border:1px solid rgba(212,175,55,0.2); background:#080808; box-shadow:0 8px 40px rgba(0,0,0,0.8); z-index:50; }
  .sia-panel-header { display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1rem; border-bottom:1px solid rgba(212,175,55,0.1); }
  .sia-panel-title { font-family:'Cinzel',serif; font-size:0.75rem; color:#f0e8d0; letter-spacing:0.12em; }
  .sia-close { background:none; border:none; color:#6a6258; cursor:pointer; font-size:1rem; line-height:1; padding:0; }
  .sia-close:hover { color:#d4af37; }
  .sia-messages { height:220px; overflow-y:auto; padding:0.75rem 1rem; display:flex; flex-direction:column; gap:0.5rem; }
  .sia-msg { max-width:90%; padding:0.5rem 0.75rem; font-size:0.82rem; line-height:1.6; font-family:'Cormorant Garamond',serif; }
  .sia-msg-user { align-self:flex-end; background:rgba(212,175,55,0.12); color:#e8e0d0; border:1px solid rgba(212,175,55,0.2); }
  .sia-msg-assistant { align-self:flex-start; background:#0c0c0c; color:#9a9288; font-style:italic; border:1px solid rgba(212,175,55,0.06); }
  .sia-typing { align-self:flex-start; font-size:0.78rem; color:rgba(212,175,55,0.4); font-style:italic; font-family:'Cormorant Garamond',serif; padding:0.25rem 0; }
  .sia-input-row { display:flex; gap:0.5rem; padding:0.75rem 1rem; border-top:1px solid rgba(212,175,55,0.1); }
  .sia-input { flex:1; background:#0c0c0c; border:1px solid rgba(212,175,55,0.15); color:#e8e0d0; font-family:'Cormorant Garamond',serif; font-size:0.85rem; padding:0.4rem 0.6rem; }
  .sia-input:focus { outline:none; border-color:rgba(212,175,55,0.4); }
  .sia-input::placeholder { color:#333; }
  .sia-send { background:#d4af37; border:none; color:#050505; font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.15em; padding:0 0.75rem; cursor:pointer; }
  .sia-send:disabled { background:#333; color:#666; cursor:not-allowed; }
`;

export default function AICurator({ context = "" }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    { role: "assistant", content: t("aiCurator.greeting") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setLoading(true);

    const systemPrompt = `You are SIA — the AI Curator at Musée-Crosdale, a luxury digital fine-art institution powered by the Facinations protocol.${context ? `\nContext: ${context}` : ""}
Respond as SIA — concise, knowledgeable, slightly poetic. Under 3 sentences unless asked for more.`;

    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const reply = await askClaude(systemPrompt, msg, history);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: t("aiCurator.error") },
      ]);
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
              </div>
            ))}
            {loading && <div className="sia-typing">{t("aiCurator.typing")}</div>}
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
