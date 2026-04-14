// src/components/community/ThreemaPortal.tsx
// Threema Gateway contact portal.
// Users send a secure message that is forwarded to the admin Threema ID via the Gateway.
// VITE_THREEMA_CONTACT_ID — public Threema ID shown on the portal (default: UH64B9C6)

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const CONTACT_ID = (import.meta.env.VITE_THREEMA_CONTACT_ID as string | undefined) || "UH64B9C6";
const THREEMA_DEEP_LINK = `https://threema.id/${CONTACT_ID}`;

type FormState = "idle" | "sending" | "sent" | "error";

const S: Record<string, React.CSSProperties> = {
  root: { display: "flex", flexDirection: "column", gap: "1.5rem" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" },

  // ID card
  idCard: {
    border: "1px solid rgba(212,175,55,0.18)",
    background: "#1c1c1c",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  idLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: "0.52rem",
    letterSpacing: "0.25em",
    textTransform: "uppercase" as const,
    color: "#6a6258",
    margin: 0,
  },
  idValue: {
    fontFamily: "monospace",
    fontSize: "1.3rem",
    letterSpacing: "0.12em",
    color: "#d4af37",
    margin: 0,
  },
  idBody: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "0.82rem",
    color: "#8a8278",
    lineHeight: 1.7,
    fontStyle: "italic",
    margin: 0,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    fontFamily: "'Cinzel', serif",
    fontSize: "0.5rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#5cb85c",
    border: "1px solid rgba(92,184,92,0.25)",
    padding: "0.2rem 0.55rem",
    alignSelf: "flex-start",
  },
  addBtn: {
    display: "inline-block",
    padding: "0.45rem 1.25rem",
    fontFamily: "'Cinzel', serif",
    fontSize: "0.55rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    background: "#d4af37",
    color: "#141414",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
    alignSelf: "flex-start",
  },

  // Form
  formCard: {
    border: "1px solid rgba(212,175,55,0.12)",
    background: "#1a1a1a",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  formTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: "0.55rem",
    letterSpacing: "0.25em",
    textTransform: "uppercase" as const,
    color: "#8a8278",
    margin: 0,
  },
  inputRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" },
  input: {
    background: "#141414",
    border: "1px solid rgba(212,175,55,0.1)",
    color: "#f2ece0",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "0.88rem",
    padding: "0.55rem 0.75rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  textarea: {
    background: "#141414",
    border: "1px solid rgba(212,175,55,0.1)",
    color: "#f2ece0",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "0.88rem",
    padding: "0.55rem 0.75rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
    resize: "vertical" as const,
    minHeight: 100,
  },
  submitBtn: {
    padding: "0.55rem 1.5rem",
    fontFamily: "'Cinzel', serif",
    fontSize: "0.55rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    background: "#d4af37",
    color: "#141414",
    border: "none",
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  submitBtnDisabled: {
    background: "#333",
    color: "#555",
    cursor: "not-allowed",
  },
  notice: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "0.78rem",
    color: "#6a6258",
    fontStyle: "italic",
    lineHeight: 1.6,
    margin: 0,
  },

  // States
  sentBox: {
    border: "1px solid rgba(92,184,92,0.2)",
    background: "rgba(92,184,92,0.04)",
    padding: "1.5rem",
    textAlign: "center" as const,
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "0.9rem",
    color: "#5cb85c",
    lineHeight: 1.7,
    fontStyle: "italic",
  },
  errorBox: {
    border: "1px solid rgba(220,0,80,0.2)",
    background: "rgba(220,0,80,0.03)",
    padding: "0.75rem 1rem",
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "0.82rem",
    color: "#e05",
    fontStyle: "italic",
  },
};

export default function ThreemaPortal() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setState("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/threema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          text: message.trim(),
          from_name: name.trim() || undefined,
          from_email: email.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error ?? "Failed to send message.");
        setState("error");
      } else {
        setState("sent");
      }
    } catch (err: any) {
      setErrorMsg(err.message ?? "Network error.");
      setState("error");
    }
  }

  function reset() {
    setName("");
    setEmail("");
    setMessage("");
    setState("idle");
    setErrorMsg("");
  }

  return (
    <div style={S.root}>
      <div style={S.twoCol}>
        {/* Left — Threema ID card */}
        <div style={S.idCard}>
          <p style={S.idLabel}>{t("threema.id_label")}</p>
          <p style={S.idValue}>{CONTACT_ID}</p>
          <div style={S.badge}>
            <span>●</span> {t("threema.encrypted_badge")}
          </div>
          <p style={S.idBody}>{t("threema.id_body")}</p>
          <a href={THREEMA_DEEP_LINK} target="_blank" rel="noopener noreferrer" style={S.addBtn}>
            {t("threema.open_app")}
          </a>
        </div>

        {/* Right — Send message form */}
        <div style={S.formCard}>
          <p style={S.formTitle}>{t("threema.form_title")}</p>

          {state === "sent" ? (
            <div>
              <div style={S.sentBox}>{t("threema.sent")}</div>
              <button
                style={{ ...S.submitBtn, marginTop: "1rem" }}
                onClick={reset}
              >
                {t("threema.send_another")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={S.inputRow}>
                <input
                  style={S.input}
                  type="text"
                  placeholder={t("threema.name_placeholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={state === "sending"}
                />
                <input
                  style={S.input}
                  type="email"
                  placeholder={t("threema.email_placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={state === "sending"}
                />
              </div>
              <textarea
                style={S.textarea}
                placeholder={t("threema.message_placeholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={state === "sending"}
              />
              {state === "error" && (
                <div style={S.errorBox}>{errorMsg}</div>
              )}
              <button
                type="submit"
                style={{
                  ...S.submitBtn,
                  ...(state === "sending" || !message.trim() ? S.submitBtnDisabled : {}),
                }}
                disabled={state === "sending" || !message.trim()}
              >
                {state === "sending" ? t("threema.sending") : t("threema.submit")}
              </button>
              <p style={S.notice}>{t("threema.notice")}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
