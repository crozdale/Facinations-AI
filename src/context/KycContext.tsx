// src/context/KycContext.tsx
// Holds KYC verification state for the current session.
// Status and applicationId persist to localStorage.

import React, { createContext, useContext, useState, useCallback } from "react";

export type KycStatus = "idle" | "pending" | "approved" | "rejected";

export interface KycSubmitPayload {
  firstName: string;
  lastName: string;
  dob: string;
  country: string;
  docType: string;
}

export interface KycSubmitResult {
  applicationId: string;
  resumeUrl: string | null;
  configured: boolean;
}

interface KycCtx {
  status: KycStatus;
  applicationId: string | null;
  /** Calls /api/kyc, transitions idle → pending, stores applicationId */
  submitVerification: (payload: KycSubmitPayload) => Promise<KycSubmitResult>;
  /** Polls /api/kyc/status — call periodically on the confirmation screen */
  checkStatus: () => Promise<KycStatus>;
  startVerification: () => void;   // legacy: sets pending without API call
  approveStub: () => void;         // dev-only
  rejectStub: () => void;          // dev-only
  reset: () => void;
}

const LS_STATUS = "facinations_kyc_status";
const LS_APP_ID = "facinations_kyc_app_id";

function loadStatus(): KycStatus {
  try {
    const v = localStorage.getItem(LS_STATUS);
    if (v === "pending" || v === "approved" || v === "rejected") return v;
  } catch {}
  return "idle";
}

function loadAppId(): string | null {
  try { return localStorage.getItem(LS_APP_ID); } catch { return null; }
}

function saveStatus(s: KycStatus) {
  try { localStorage.setItem(LS_STATUS, s); } catch {}
}

function saveAppId(id: string | null) {
  try {
    if (id) localStorage.setItem(LS_APP_ID, id);
    else localStorage.removeItem(LS_APP_ID);
  } catch {}
}

const KycContext = createContext<KycCtx | null>(null);

export function KycProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus]           = useState<KycStatus>(loadStatus);
  const [applicationId, setAppId]     = useState<string | null>(loadAppId);

  const set = useCallback((s: KycStatus) => {
    setStatus(s);
    saveStatus(s);
  }, []);

  const submitVerification = useCallback(async (payload: KycSubmitPayload): Promise<KycSubmitResult> => {
    const res = await fetch("/api/kyc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error ?? "Verification submission failed");
    }

    const data: KycSubmitResult & { error?: string } = await res.json();

    setAppId(data.applicationId);
    saveAppId(data.applicationId);
    set("pending");

    return {
      applicationId: data.applicationId,
      resumeUrl: data.resumeUrl ?? null,
      configured: data.configured,
    };
  }, [set]);

  const checkStatus = useCallback(async (): Promise<KycStatus> => {
    const id = loadAppId();
    if (!id) return "pending";

    try {
      const res = await fetch(`/api/kyc/status?id=${encodeURIComponent(id)}`);
      if (!res.ok) return "pending";
      const { status: s } = await res.json();
      const mapped = (s === "approved" || s === "rejected") ? s : "pending";
      if (mapped !== status) set(mapped);
      return mapped;
    } catch {
      return "pending";
    }
  }, [status, set]);

  return (
    <KycContext.Provider value={{
      status,
      applicationId,
      submitVerification,
      checkStatus,
      startVerification: () => set("pending"),
      approveStub:       () => set("approved"),
      rejectStub:        () => set("rejected"),
      reset:             () => { set("idle"); setAppId(null); saveAppId(null); },
    }}>
      {children}
    </KycContext.Provider>
  );
}

export function useKyc(): KycCtx {
  const ctx = useContext(KycContext);
  if (!ctx) throw new Error("useKyc must be used inside <KycProvider>");
  return ctx;
}
