// src/pages/KycVerify.tsx
// KYC verification flow — 4 steps.
// Step 3 submits to /api/kyc (Persona when configured, stub otherwise).
// Step 4 polls /api/kyc/status and redirects on approval.

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useKyc } from "../context/KycContext";
import { getRegion } from "../config/regionFlags";
import { useMeta } from "../hooks/useMeta";

type Step = 1 | 2 | 3 | 4;

interface PersonalDetails {
  firstName: string;
  lastName: string;
  dob: string;
  country: string;
}

const COUNTRIES = [
  "United States", "United Kingdom", "Germany", "France", "Canada",
  "Australia", "Japan", "Singapore", "United Arab Emirates", "Other",
];

const DOC_TYPES = [
  { id: "passport",  label: "Passport",          icon: "🛂" },
  { id: "driving",   label: "Driving Licence",    icon: "🪪" },
  { id: "national",  label: "National ID Card",   icon: "🆔" },
];

const H: React.CSSProperties = {
  fontFamily: "'Cinzel', serif", fontWeight: 400, letterSpacing: "0.08em", color: "#f0e8d0",
};

const LABEL: React.CSSProperties = {
  display: "block", marginBottom: "0.3rem",
  fontFamily: "'Cinzel', serif", fontSize: "0.55rem",
  letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(212,175,55,0.5)",
};

const INPUT: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  padding: "0.6rem 0.85rem",
  background: "#0c0c0c", border: "1px solid rgba(212,175,55,0.18)",
  color: "#e8e0d0", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem",
};

const SELECT: React.CSSProperties = { ...INPUT, appearance: "none", cursor: "pointer" };

const BTN: React.CSSProperties = {
  padding: "0.65rem 2rem", background: "#d4af37", border: "none",
  color: "#050505", fontFamily: "'Cinzel', serif", fontSize: "0.6rem",
  letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer",
};

const BTN_GHOST: React.CSSProperties = {
  ...BTN, background: "transparent",
  border: "1px solid rgba(212,175,55,0.2)", color: "#6a6258",
};

export default function KycVerify() {
  const { t } = useTranslation();
  const STEPS = [t("kyc.step_details"), t("kyc.step_document"), t("kyc.step_upload"), t("kyc.step_confirm")];
  const navigate = useNavigate();
  const { submitVerification, checkStatus, approveStub, status } = useKyc();
  useMeta({
    title: t("kyc.title"),
    description: "Complete KYC identity verification to access swap and subscription features on Musée-Crosdale.",
    noIndex: true,
  });
  const region = getRegion();

  const [step, setStep] = useState<Step>(1);
  const [details, setDetails] = useState<PersonalDetails>({ firstName: "", lastName: "", dob: "", country: "" });
  const [docType, setDocType] = useState<string>("");
  const [fileSelected, setFileSelected] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [providerConfigured, setProviderConfigured] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Already verified — redirect away
  if (status === "approved") {
    return (
      <main style={{ background: "#080808", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem", color: "#5cb85c" }}>✓</div>
          <h2 style={{ ...H, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{t("kyc.verified_heading")}</h2>
          <p style={{ color: "#6a6258", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", marginBottom: "1.5rem" }}>
            {t("kyc.verified_body")}
          </p>
          <Link to="/swap" style={BTN}>{t("kyc.btn_go_swap")}</Link>
        </div>
      </main>
    );
  }

  function detailsValid() {
    return details.firstName.trim() && details.lastName.trim() && details.dob && details.country;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitVerification({
        firstName: details.firstName,
        lastName:  details.lastName,
        dob:       details.dob,
        country:   details.country,
        docType,
      });
      setResumeUrl(result.resumeUrl);
      setProviderConfigured(result.configured);
      setStep(4);
    } catch (err: any) {
      setSubmitError(err?.message ?? "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Start polling status once on step 4 (max 60 × 5s = 5 minutes)
  useEffect(() => {
    if (step !== 4) return;
    let attempts = 0;
    pollRef.current = setInterval(async () => {
      attempts++;
      const s = await checkStatus();
      if (s === "approved") { navigate("/swap"); }
      if (s === "rejected" || attempts >= 60) {
        if (pollRef.current) clearInterval(pollRef.current);
      }
    }, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // Dev shortcut (only shown when provider not configured)
  async function simulateApproval() {
    await new Promise((r) => setTimeout(r, 800));
    approveStub();
    navigate("/swap");
  }

  return (
    <main style={{ background: "#080808", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(212,175,55,0.1)", padding: "1.25rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.25em", color: "#d4af37", textTransform: "uppercase" }}>
          {t("kyc.title")}
        </span>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.15em", color: "#4a4238" }}>
          {t("kyc.region_label", { region })}
        </span>
      </div>

      <div style={{ maxWidth: 520, margin: "3rem auto", padding: "0 1.5rem" }}>

        {/* Step progress */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2.5rem" }}>
          {STEPS.map((label, i) => {
            const n = (i + 1) as Step;
            const active = n === step;
            const done = n < step;
            return (
              <React.Fragment key={label}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    border: `1px solid ${done ? "#5cb85c" : active ? "#d4af37" : "rgba(212,175,55,0.2)"}`,
                    background: done ? "rgba(92,184,92,0.1)" : active ? "rgba(212,175,55,0.08)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Cinzel', serif", fontSize: "0.65rem",
                    color: done ? "#5cb85c" : active ? "#d4af37" : "#333",
                  }}>
                    {done ? "✓" : n}
                  </div>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.5rem", letterSpacing: "0.1em", color: active ? "#d4af37" : "#333", textTransform: "uppercase" }}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 1, background: done ? "rgba(92,184,92,0.3)" : "rgba(212,175,55,0.1)", margin: "0 0.5rem 1.2rem" }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step 1 — Personal details */}
        {step === 1 && (
          <div>
            <h2 style={{ ...H, fontSize: "1.1rem", marginBottom: "0.4rem" }}>{t("kyc.details_heading")}</h2>
            <p style={{ color: "#6a6258", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
              {t("kyc.details_body")}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={LABEL}>{t("kyc.label_first_name")}</label>
                  <input style={INPUT} value={details.firstName} onChange={(e) => setDetails((d) => ({ ...d, firstName: e.target.value }))} placeholder={t("kyc.placeholder_first_name")} />
                </div>
                <div>
                  <label style={LABEL}>{t("kyc.label_last_name")}</label>
                  <input style={INPUT} value={details.lastName} onChange={(e) => setDetails((d) => ({ ...d, lastName: e.target.value }))} placeholder={t("kyc.placeholder_last_name")} />
                </div>
              </div>
              <div>
                <label style={LABEL}>{t("kyc.label_dob")}</label>
                <input type="date" style={INPUT} value={details.dob} onChange={(e) => setDetails((d) => ({ ...d, dob: e.target.value }))} />
              </div>
              <div>
                <label style={LABEL}>{t("kyc.label_country")}</label>
                <select style={SELECT} value={details.country} onChange={(e) => setDetails((d) => ({ ...d, country: e.target.value }))}>
                  <option value="">{t("kyc.placeholder_country")}</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem" }}>
              <button style={{ ...BTN, background: detailsValid() ? "#d4af37" : "#333", color: detailsValid() ? "#050505" : "#555", cursor: detailsValid() ? "pointer" : "not-allowed" }}
                onClick={() => detailsValid() && setStep(2)} disabled={!detailsValid()}>
                {t("common.continue")}
              </button>
              <Link to="/" style={BTN_GHOST}>{t("common.cancel")}</Link>
            </div>
          </div>
        )}

        {/* Step 2 — Document type */}
        {step === 2 && (
          <div>
            <h2 style={{ ...H, fontSize: "1.1rem", marginBottom: "0.4rem" }}>{t("kyc.doc_heading")}</h2>
            <p style={{ color: "#6a6258", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
              {t("kyc.doc_body")}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {DOC_TYPES.map((doc) => (
                <button key={doc.id} onClick={() => setDocType(doc.id)} style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "1rem 1.25rem",
                  border: `1px solid ${docType === doc.id ? "#d4af37" : "rgba(212,175,55,0.15)"}`,
                  background: docType === doc.id ? "rgba(212,175,55,0.05)" : "#0a0a0a",
                  color: docType === doc.id ? "#d4af37" : "#9a9288",
                  fontFamily: "'Cinzel', serif", fontSize: "0.75rem", letterSpacing: "0.1em",
                  cursor: "pointer", textAlign: "left",
                }}>
                  <span style={{ fontSize: "1.4rem" }}>{doc.icon}</span>
                  {doc.label}
                  {docType === doc.id && <span style={{ marginLeft: "auto", fontSize: "0.7rem" }}>✓</span>}
                </button>
              ))}
            </div>
            <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem" }}>
              <button style={{ ...BTN, background: docType ? "#d4af37" : "#333", color: docType ? "#050505" : "#555", cursor: docType ? "pointer" : "not-allowed" }}
                onClick={() => docType && setStep(3)} disabled={!docType}>
                {t("common.continue")}
              </button>
              <button style={BTN_GHOST} onClick={() => setStep(1)}>{t("common.back")}</button>
            </div>
          </div>
        )}

        {/* Step 3 — Upload */}
        {step === 3 && (
          <div>
            <h2 style={{ ...H, fontSize: "1.1rem", marginBottom: "0.4rem" }}>{t("kyc.upload_heading")}</h2>
            <p style={{ color: "#6a6258", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
              {t("kyc.upload_body", { documentType: DOC_TYPES.find((d) => d.id === docType)?.label ?? "" })}
            </p>

            {/* Upload zone */}
            <label style={{
              display: "block", border: `2px dashed ${fileSelected ? "#d4af37" : "rgba(212,175,55,0.2)"}`,
              background: fileSelected ? "rgba(212,175,55,0.04)" : "#0a0a0a",
              padding: "2.5rem", textAlign: "center", cursor: "pointer",
            }}>
              <input type="file" accept="image/*,.pdf" style={{ display: "none" }}
                onChange={(e) => setFileSelected(!!e.target.files?.length)} />
              <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{fileSelected ? "✓" : "📄"}</div>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.15em", color: fileSelected ? "#d4af37" : "#4a4238", margin: "0 0 0.4rem" }}>
                {fileSelected ? t("kyc.upload_selected") : t("kyc.upload_prompt")}
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", color: "#333", margin: 0, fontStyle: "italic" }}>
                {t("kyc.upload_hint")}
              </p>
            </label>

            <p style={{ marginTop: "1rem", fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.1em", color: "#2a2a2a" }}>
              🔒 {t("kyc.upload_security")}
            </p>

            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                style={{ ...BTN, background: fileSelected && !submitting ? "#d4af37" : "#333", color: fileSelected && !submitting ? "#050505" : "#555", cursor: fileSelected && !submitting ? "pointer" : "not-allowed" }}
                onClick={handleSubmit} disabled={!fileSelected || submitting}>
                {submitting ? t("kyc.btn_submitting") : t("kyc.btn_submit_verification")}
              </button>
              <button style={BTN_GHOST} onClick={() => setStep(2)}>{t("common.back")}</button>
            </div>
            {submitError && (
              <p style={{ marginTop: "0.75rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", color: "#f88" }}>
                {submitError}
              </p>
            )}
          </div>
        )}

        {/* Step 4 — Confirmation */}
        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⏳</div>
            <h2 style={{ ...H, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{t("kyc.confirm_heading")}</h2>
            <p style={{ color: "#6a6258", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "2rem" }}>
              {t("kyc.confirm_body")}
            </p>
            <div style={{ display: "inline-flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
              {/* Persona hosted flow — complete document upload on their platform */}
              {providerConfigured && resumeUrl && (
                <a href={resumeUrl} style={BTN}>
                  Complete Verification →
                </a>
              )}
              {/* Dev-only stub: visible only when Persona is not configured */}
              {!providerConfigured && (
                <button style={{ ...BTN, fontSize: "0.55rem", padding: "0.5rem 1.5rem", background: "rgba(92,184,92,0.15)", color: "#5cb85c", border: "1px solid rgba(92,184,92,0.3)" }}
                  onClick={simulateApproval}>
                  [Dev] Simulate Approval →
                </button>
              )}
              <Link to="/" style={{ fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.15em", color: "#4a4238", textDecoration: "none" }}>
                {t("kyc.btn_return_home")}
              </Link>
            </div>
          </div>
        )}

        {/* Footer note */}
        {step !== 4 && (
          <p style={{ marginTop: "2.5rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.78rem", color: "#2a2a2a", fontStyle: "italic", lineHeight: 1.6 }}>
            {t("kyc.footer_note")}{" "}
            <Link to="/legal" style={{ color: "#3a3a3a" }}>{t("legal.tab_privacy")}</Link>
          </p>
        )}
      </div>
    </main>
  );
}
