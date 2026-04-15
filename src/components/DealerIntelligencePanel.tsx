// src/components/DealerIntelligencePanel.tsx
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { streamClaude } from "../utils/askClaude";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const S = {
  section: {
    border: "1px solid rgba(212,175,55,0.15)",
    background: "#1c1c1c",
    padding: "1.75rem",
  } as React.CSSProperties,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.25rem",
    gap: "1rem",
    flexWrap: "wrap" as const,
  } as React.CSSProperties,
  eyebrow: {
    fontFamily: "'Cinzel',serif",
    fontSize: "0.52rem",
    letterSpacing: "0.35em",
    textTransform: "uppercase" as const,
    color: "#d4af37",
    margin: "0 0 0.3rem",
  } as React.CSSProperties,
  title: {
    fontFamily: "'Cinzel',serif",
    fontSize: "1rem",
    fontWeight: 400,
    color: "#f8f2e4",
    letterSpacing: "0.06em",
    margin: "0 0 0.25rem",
  } as React.CSSProperties,
  subtitle: {
    fontFamily: "'Cormorant Garamond',serif",
    fontSize: "0.85rem",
    color: "#8a8278",
    fontStyle: "italic",
    margin: 0,
  } as React.CSSProperties,
  chatBox: {
    border: "1px solid rgba(212,175,55,0.08)",
    background: "#141414",
    display: "flex",
    flexDirection: "column" as const,
    height: "280px",
    overflow: "hidden",
  } as React.CSSProperties,
  messages: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "1rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.75rem",
  } as React.CSSProperties,
  bubbleUser: {
    alignSelf: "flex-end" as const,
    background: "rgba(212,175,55,0.06)",
    border: "1px solid rgba(212,175,55,0.2)",
    padding: "0.5rem 0.85rem",
    fontFamily: "'Cormorant Garamond',serif",
    fontSize: "0.9rem",
    color: "#f2ece0",
    maxWidth: "80%",
    lineHeight: 1.6,
  } as React.CSSProperties,
  bubbleAi: {
    alignSelf: "flex-start" as const,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(212,175,55,0.06)",
    padding: "0.5rem 0.85rem",
    fontFamily: "'Cormorant Garamond',serif",
    fontSize: "0.9rem",
    color: "#ddd6c8",
    maxWidth: "88%",
    lineHeight: 1.6,
    fontStyle: "italic",
  } as React.CSSProperties,
  form: {
    borderTop: "1px solid rgba(212,175,55,0.08)",
    background: "#0f0f0f",
    padding: "0.65rem 1rem",
    display: "flex",
    gap: "0.75rem",
    alignItems: "center",
  } as React.CSSProperties,
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    fontFamily: "'Cormorant Garamond',serif",
    fontSize: "0.92rem",
    color: "#f2ece0",
  } as React.CSSProperties,
  sendBtn: {
    fontFamily: "'Cinzel',serif",
    fontSize: "0.5rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "#d4af37",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0.25rem 0",
  } as React.CSSProperties,
  cursor: {
    display: "inline-block",
    width: "2px",
    height: "0.85em",
    background: "rgba(212,175,55,0.5)",
    marginLeft: "2px",
    verticalAlign: "middle",
    animation: "dealer-blink 0.7s infinite",
  } as React.CSSProperties,
};

const SYSTEM = `You are the Dealer Intelligence SIA (Synthetic Intelligence Analyst) for Musée-Crosdale / Facinations — a luxury fine art platform that vaults and fractionalises artworks on-chain using the Facinations protocol.

You advise gallery owners, dealer principals, art consultants, and serious collectors on:
- Inventory mix strategy and portfolio construction
- Acquisition desking: reserve pricing, offer structures, negotiation positioning
- Fractional vault ownership: ERC-1155 fractions, liquidity, entry/exit timing
- XER token economics: AMM mechanics, swap fees, price discovery
- On-chain provenance: smart contract verification, metadata standards
- Fine art market performance: sector trends, risk-adjusted returns, collector strategy

Be concise (4 sentences max unless asked to expand), data-oriented, and authoritative. Where precise figures are unavailable, give directional guidance. Never fabricate auction results or specific price histories. Treat the user as a sophisticated principal.`;

const GREETING =
  "Dealer Intelligence is your Synthetic Intelligence Analyst for Fine Art. Ask about inventory strategy, fractional ownership, XER economics, or market performance.";

const STORAGE_KEY = "dealer_msgs";

export default function DealerIntelligencePanel() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [{ role: "assistant", content: GREETING }];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); } catch {}
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setInput("");

    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ]);
    setLoading(true);

    try {
      await streamClaude(
        {
          model: "claude-sonnet-4-6",
          max_tokens: 500,
          system: SYSTEM,
          messages: [...history, { role: "user", content: trimmed }],
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
    } catch (err: unknown) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={S.section}>
      <style>{`@keyframes dealer-blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
      <div style={S.header}>
        <div>
          <p style={S.eyebrow}>Facinations · SIA</p>
          <h2 style={S.title}>{t("dealerIntel.title")}</h2>
          <p style={S.subtitle}>
            {t("dealerIntel.subtitle")}
          </p>
        </div>
      </div>

      <div style={S.chatBox}>
        <div style={S.messages}>
          {messages.map((m, idx) => (
            <div key={idx} style={m.role === "user" ? S.bubbleUser : S.bubbleAi}>
              {m.content}
              {loading && idx === messages.length - 1 && m.role === "assistant" && (
                <span style={S.cursor} />
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSubmit} style={S.form}>
          <input
            style={S.input}
            placeholder="Ask about inventory strategy, XER economics, provenance…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={loading} style={{ ...S.sendBtn, opacity: loading ? 0.35 : 1 }}>{t("dealerIntel.send")}</button>
        </form>
      </div>
    </section>
  );
}
