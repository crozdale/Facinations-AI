// wire-i18n-components.mjs
// Run with: node wire-i18n-components.mjs
// from C:\Users\crozd\musee-crosdale

import fs from "fs";
import path from "path";

const root = "src";

// ── Helpers ──────────────────────────────────────────────────────────────────
function patch(file, replacements) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) { console.log(`SKIP (not found): ${file}`); return; }
  let src = fs.readFileSync(full, "utf8");
  const original = src;
  for (const [from, to] of replacements) {
    src = src.split(from).join(to);
  }
  if (src === original) { console.log(`SKIP (no changes): ${file}`); return; }
  fs.writeFileSync(full, src, "utf8");
  console.log(`PATCHED: ${file}`);
}

// ── 1. TeleportViewer ─────────────────────────────────────────────────────────
patch("components/teleport/TeleportViewer.tsx", [
  // Add useTranslation import
  [
    `import React, { useState } from "react";`,
    `import React, { useState } from "react";
import { useTranslation } from "react-i18next";`
  ],
  // Add t() to component
  [
    `export function TeleportViewer({ sceneId, splatCount, artworkTitle }: TeleportViewerProps) {
  const [tpOn, setTpOn] = useState(false);`,
    `export function TeleportViewer({ sceneId, splatCount, artworkTitle }: TeleportViewerProps) {
  const { t } = useTranslation();
  const [tpOn, setTpOn] = useState(false);`
  ],
  // Varjo Teleport label
  [`>Varjo Teleport<`, `>{t("teleport.varjo")}<`],
  // splats
  [`{splatCount} splats`, `{splatCount} {t("teleport.splats")}`],
  // Loading
  [`>Loadingâ€¦<`, `>{t("teleport.loading")}<`],
  // Scene unavailable
  [`>Scene unavailable<`, `>{t("teleport.scene_unavailable")}<`],
  // Enter immersive space
  [`Enter immersive space`, `{t("teleport.enter_space")}`],
  // Exit/Enter space button
  [`{tpOn ? "Exit space" : "Enter space"}`, `{tpOn ? t("teleport.exit_space") : t("teleport.enter_space")}`],
  // ready/idle
  [`{tpOn ? "ready" : "idle"}`, `{tpOn ? t("teleport.ready") : t("teleport.idle")}`],
]);

// ── 2. FractionPanel ──────────────────────────────────────────────────────────
patch("components/FractionPanel.tsx", [
  // Add useTranslation import
  [
    `import React, { useState, useEffect, useCallback } from "react";`,
    `import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";`
  ],
  // Add t() to component
  [
    `export default function FractionPanel({ vault }: Props) {
  const { provider, account, connect } = useWeb3();`,
    `export default function FractionPanel({ vault }: Props) {
  const { t } = useTranslation();
  const { provider, account, connect } = useWeb3();`
  ],
  // Eyebrow
  [`<p className="fp-eyebrow">Fractional Ownership</p>`, `<p className="fp-eyebrow">{t("fractionPanel.title")}</p>`],
  // Stat labels
  [`<p className="fp-stat-label">Total Fractions</p>`, `<p className="fp-stat-label">{t("fractionPanel.total")}</p>`],
  [`<p className="fp-stat-label">Available</p>`, `<p className="fp-stat-label">{t("fractionPanel.available")}</p>`],
  [`<p className="fp-stat-label">Price / Fraction</p>`, `<p className="fp-stat-label">{t("fractionPanel.price_per")}</p>`],
  [`<p className="fp-stat-label">Token ID</p>`, `<p className="fp-stat-label">{t("fractionPanel.token_id")}</p>`],
  // Connect prompt
  [
    `Connect your wallet to view your fraction balance.`,
    `{t("fractionPanel.connect_prompt")}`
  ],
  // Your Balance label
  [`<span className="fp-balance-label">Your Balance</span>`, `<span className="fp-balance-label">{t("fractionPanel.your_balance")}</span>`],
  // fractions suffix
  [`{balanceDisplay} fractions`, `{balanceDisplay} {t("fractionPanel.fractions_owned")}`],
  // Tab labels
  [`>
              Acquire Fractions
            <`, `>{t("fractionPanel.acquire")}<`],
  [`>
                Transfer
              <`, `>{t("fractionPanel.transfer")}<`],
  // Enquiry submitted notice
  [
    `Enquiry submitted. A curator will be in touch within two business days to discuss provenance documentation and on-chain settlement.`,
    `{t("fractionPanel.enquiry_submitted")}`
  ],
  // Acquire notice
  [
    `Fraction acquisition is a curated process. Submit your expression of interest and our team will complete the on-chain transfer after verification.`,
    `{t("fractionPanel.acquire_notice")}`
  ],
  // Full Name label
  [`<label className="fp-label">Full Name</label>`, `<label className="fp-label">{t("fractionPanel.full_name")}</label>`],
  // Email label
  [`<label className="fp-label">Email *</label>`, `<label className="fp-label">{t("fractionPanel.email_required")}</label>`],
  // Fractions Requested label
  [`<label className="fp-label">Fractions Requested *</label>`, `<label className="fp-label">{t("fractionPanel.fractions_req")}</label>`],
  // Indicative total
  [`Indicative total:`, `{t("fractionPanel.indicative_total")}`],
  // Message optional label
  [`<label className="fp-label">Message (optional)</label>`, `<label className="fp-label">{t("fractionPanel.message_opt")}</label>`],
  // Submit button
  [`{acqState === "sending" ? "Submittingâ€¦" : "Submit Enquiry"}`, `{acqState === "sending" ? t("fractionPanel.submitting") : t("fractionPanel.submit_enquiry")}`],
  // Transfer confirmed
  [
    `Transfer confirmed.{" "}`,
    `{t("fractionPanel.transfer_confirmed")}{" "}`
  ],
  // View on Etherscan
  [`>
                    View on Etherscan â†—
                  <`, `>{t("fractionPanel.view_etherscan")}<`],
  // Transfer notice
  [
    `Transfer fractions to another wallet via ERC1155 safeTransferFrom. Ensure your wallet is connected to Sepolia.`,
    `{t("fractionPanel.transfer_notice")}`
  ],
  // Recipient Address label
  [`<label className="fp-label">Recipient Address *</label>`, `<label className="fp-label">{t("fractionPanel.recipient")}</label>`],
  // Quantity label
  [`<label className="fp-label">Quantity *</label>`, `<label className="fp-label">{t("fractionPanel.quantity")}</label>`],
  // Max label
  [`Max: {balance?.toString()} fractions`, `{t("fractionPanel.max_label")} {balance?.toString()} {t("fractionPanel.fractions_owned")}`],
  // Transfer On-Chain / Awaiting button
  [`{xfrState === "sending" ? "Awaiting confirmationâ€¦" : "Transfer On-Chain"}`, `{xfrState === "sending" ? t("fractionPanel.awaiting") : t("fractionPanel.transfer_onchain")}`],
  // Reset button
  [`>
                    Reset
                  <`, `>{t("fractionPanel.reset")}<`],
]);

// ── 3. GovernancePanel ────────────────────────────────────────────────────────
patch("components/GovernancePanel.tsx", [
  [
    `import { useState } from "react";`,
    `import { useState } from "react";
import { useTranslation } from "react-i18next";`
  ],
  [
    `export default function GovernancePanel() {
  const { governor, emergency } = useGovernance();`,
    `export default function GovernancePanel() {
  const { t } = useTranslation();
  const { governor, emergency } = useGovernance();`
  ],
  [`<h3>Governance</h3>`, `<h3>{t("governance.title")}</h3>`],
  [`<h4>Register Vault</h4>`, `<h4>{t("governance.register_vault")}</h4>`],
  [`placeholder="Vault ID"`, `placeholder={t("governance.vault_id_ph")}`],
  [`placeholder="Vault Contract"`, `placeholder={t("governance.vault_contract_ph")}`],
  [`placeholder="Swap Contract"`, `placeholder={t("governance.swap_contract_ph")}`],
  [`            Premium Required`, `            {t("governance.premium_required")}`],
  [`<button onClick={submitVault}>Register Vault</button>`, `<button onClick={submitVault}>{t("governance.register_btn")}</button>`],
  [`<h4>Emergency Controls</h4>`, `<h4>{t("governance.emergency")}</h4>`],
  [`<button onClick={pause}>Pause Protocol</button>`, `<button onClick={pause}>{t("governance.pause")}</button>`],
  [`<button onClick={unpause}>Unpause Protocol</button>`, `<button onClick={unpause}>{t("governance.unpause")}</button>`],
]);

// ── 4. LegalViewer ────────────────────────────────────────────────────────────
patch("components/LegalViewer.tsx", [
  [
    `export default function LegalViewer({ pdf, hash }) {`,
    `import { useTranslation } from "react-i18next";

export default function LegalViewer({ pdf, hash }) {
  const { t } = useTranslation();`
  ],
  [`<h3>Legal Documentation</h3>`, `<h3>{t("legalViewer.title")}</h3>`],
  [`        View Signed PDF`, `        {t("legalViewer.view_pdf")}`],
  [`        Document Hash: <code>{hash}</code>`, `        {t("legalViewer.doc_hash")} <code>{hash}</code>`],
]);

// ── 5. VAultLegalSection ──────────────────────────────────────────────────────
patch("components/VAultLegalSection.tsx", [
  [
    `import { useState } from "react";`,
    `import { useState } from "react";
import { useTranslation } from "react-i18next";`
  ],
  [
    `export default function VaultLegalSection({ vault }) {
  const [open, setOpen] = useState(false);`,
    `export default function VaultLegalSection({ vault }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);`
  ],
  [`          Legal Summary`, `          {t("vaultLegal.summary_title")}`],
  [`          Revenue Participation Only`, `          {t("vaultLegal.revenue_only")}`],
  [
    `        Owner retains legal title and physical possession of the artwork.
        Vault tokens represent contractual economic and governance interests only.`,
    `        {t("vaultLegal.statement")}`
  ],
  [`<li>No ownership, custody, or possessory rights</li>`, `<li>{t("vaultLegal.no_ownership")}</li>`],
  [`<li>No copyright or intellectual property rights</li>`, `<li>{t("vaultLegal.no_copyright")}</li>`],
  [`<li>No right to force sale or access the artwork</li>`, `<li>{t("vaultLegal.no_force_sale")}</li>`],
  [`<li>Custody and insurance maintained by third parties</li>`, `<li>{t("vaultLegal.third_party")}</li>`],
  [`<li>Blockchain records are evidentiary only</li>`, `<li>{t("vaultLegal.blockchain_only")}</li>`],
  [`{open ? "Hide legal summary" : "View legal summary"}`, `{open ? t("vaultLegal.hide_summary") : t("vaultLegal.view_summary")}`],
  [`          View Legal Pack`, `          {t("vaultLegal.view_legal_pack")}`],
  [`        Governing Law: {vault.jurisdictionLabel} Â· Vault ID: {vault.id}`, `        {t("vaultLegal.governing_law")} {vault.jurisdictionLabel} · {t("vaultLegal.vault_id")} {vault.id}`],
]);

// ── 6. VaultList ──────────────────────────────────────────────────────────────
patch("components/VaultList.tsx", [
  [
    `import { useVaults } from "../hooks/useVaults";`,
    `import { useTranslation } from "react-i18next";
import { useVaults } from "../hooks/useVaults";`
  ],
  [
    `export default function VaultList() {
  const vaults = useVaults();`,
    `export default function VaultList() {
  const { t } = useTranslation();
  const vaults = useVaults();`
  ],
  [`<h2>Vaults</h2>`, `<h2>{t("vaultList.title")}</h2>`],
  [`{locked ? "Premium Required" : "Premium"}`, `{locked ? t("vaultList.locked") : t("vaults.premium")}`],
  [`{locked ? "Locked" : "Open Vault"}`, `{locked ? t("vaultList.locked") : t("vaultList.open_vault")}`],
]);

// ── 7. MainLayout ─────────────────────────────────────────────────────────────
patch("layouts/MainLayout.tsx", [
  [
    `import { Link, Outlet } from "react-router-dom";`,
    `import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";`
  ],
  [
    `export default function MainLayout() {
  return (`,
    `export default function MainLayout() {
  const { t } = useTranslation();
  return (`
  ],
  [`<Link to="/">Home</Link>`, `<Link to="/">{t("mainLayout.home")}</Link>`],
  [`<Link to="/swap">Swap</Link>`, `<Link to="/swap">{t("mainLayout.swap")}</Link>`],
]);

// ── 8. DealerIntelligencePanel ────────────────────────────────────────────────
patch("components/DealerIntelligencePanel.tsx", [
  [
    `import React, { useState, useRef, useEffect } from "react";`,
    `import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";`
  ],
  [
    `export default function DealerIntelligencePanel() {
  const [messages, setMessages]`,
    `export default function DealerIntelligencePanel() {
  const { t } = useTranslation();
  const [messages, setMessages]`
  ],
  [`>Facinations Â· SIA<`, `>{t("dealerIntel.eyebrow")}<`],
  [`>Dealer Intelligence<`, `>{t("dealerIntel.title")}<`],
  [
    `            AI partner for gallery owners, dealer principals, and collectors.`,
    `            {t("dealerIntel.subtitle")}`
  ],
  [`placeholder="Ask about inventory strategy, XER economics, provenanceâ€¦"`, `placeholder={t("dealerIntel.placeholder")}`],
  [`>
            Send
          <`, `>{t("dealerIntel.send")}<`],
]);

// ── 9. VVVaults ───────────────────────────────────────────────────────────────
patch("pages/VVVaults.tsx", [
  [
    `import { useParams } from "react-router-dom";`,
    `import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";`
  ],
  [
    `export default function Vault() {
  const { vaultId } = useParams();`,
    `export default function Vault() {
  const { t } = useTranslation();
  const { vaultId } = useParams();`
  ],
  [`<h2 className="text-xl font-semibold">Vault Not Found</h2>`, `<h2 className="text-xl font-semibold">{t("vvvaults.not_found_title")}</h2>`],
  [
    `          This vault is not registered in the Canonical Vault Registry.`,
    `          {t("vvvaults.not_registered")}`
  ],
  [`<h2 className="mb-2 text-lg font-semibold">Artwork</h2>`, `<h2 className="mb-2 text-lg font-semibold">{t("vvvaults.artwork_section")}</h2>`],
  [`<h2 className="mb-2 text-lg font-semibold">Legal Documentation</h2>`, `<h2 className="mb-2 text-lg font-semibold">{t("vvvaults.legal_section")}</h2>`],
  [
    `          The following legal documentation governs this vault.`,
    `          {t("vvvaults.legal_desc")}`
  ],
  [`          View Legal Pack`, `          {t("vvvaults.view_legal_pack")}`],
  [`<h2 className="mb-2 text-lg font-semibold">On-Chain Binding</h2>`, `<h2 className="mb-2 text-lg font-semibold">{t("vvvaults.chain_section")}</h2>`],
  [`{vault.contracts.vault || "Not yet deployed"}`, `{vault.contracts.vault || t("vvvaults.not_deployed")}`],
  [`<h2 className="mb-2 text-lg font-semibold">
              Mint Fractional Interests
            </h2>`, `<h2 className="mb-2 text-lg font-semibold">{t("vvvaults.mint_section")}</h2>`],
  [
    `              Minting constitutes acquisition of a fractional interest governed
              by the attached legal documentation.`,
    `              {t("vvvaults.mint_notice")}`
  ],
  [`>
              Mint
            <`, `>{t("vvvaults.mint_btn")}<`],
]);

// ── 10. Premium ───────────────────────────────────────────────────────────────
patch("pages/Premium.tsx", [
  [
    `import { useQuery } from "@apollo/client";`,
    `import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";`
  ],
  [
    `export default function Premium() {
  const { data, loading, error } = useQuery(GET_PREMIUM_USERS);`,
    `export default function Premium() {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery(GET_PREMIUM_USERS);`
  ],
  [`<p>Loading premium ledgerâ€¦</p>`, `<p>{t("common.loading")}</p>`],
  [`<h1>Premium Access Ledger</h1>`, `<h1>{t("premium.ledger_title")}</h1>`],
  [`<p>Address: {u.address}</p>`, `<p>{t("premium.address")} {u.address}</p>`],
  [`<p>Paid: {u.amountPaid.toString()}</p>`, `<p>{t("premium.paid")} {u.amountPaid.toString()}</p>`],
  [`<p>Time: {new Date(Number(u.timestamp) * 1000).toLocaleString()}</p>`, `<p>{t("premium.time")} {new Date(Number(u.timestamp) * 1000).toLocaleString()}</p>`],
]);

console.log("\nAll done. Run: pnpm build");
