// src/App.tsx
// Route-based code splitting via React.lazy + Suspense.
// Every page is loaded on-demand; only Layout, providers, and the loader are in the main bundle.

import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { KycProvider } from "./context/KycContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";

// ── Lazy page imports ─────────────────────────────────────────────────────────
const Landing      = React.lazy(() => import("./pages/Landing"));
const Home         = React.lazy(() => import("./pages/Home"));
const About        = React.lazy(() => import("./pages/About"));
const Gallery      = React.lazy(() => import("./pages/Gallery"));
const Vaults       = React.lazy(() => import("./pages/Vaults"));
const VaultDetail  = React.lazy(() => import("./pages/VaultDetail"));
const Swap         = React.lazy(() => import("./pages/Swap"));
const Studio       = React.lazy(() => import("./pages/Studio"));
const Architecture = React.lazy(() => import("./pages/Architecture"));
const Legal        = React.lazy(() => import("./pages/Legal"));
const XdaleGallery = React.lazy(() => import("./pages/XdaleGallery"));
const Swapp        = React.lazy(() => import("./pages/Swapp"));
const Analytics    = React.lazy(() => import("./pages/Analytics"));
const KycVerify    = React.lazy(() => import("./pages/KycVerify"));
const Dashboard    = React.lazy(() => import("./pages/Dashboard"));
const CheckoutSuccess = React.lazy(() => import("./pages/CheckoutSuccess"));
const CryptoSuccess   = React.lazy(() => import("./pages/CryptoSuccess"));
const PayPalSuccess   = React.lazy(() => import("./pages/PayPalSuccess"));
const Admin        = React.lazy(() => import("./pages/Admin"));
const NotFound     = React.lazy(() => import("./pages/NotFound"));

// ── Loading fallback ──────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        background: "#080808",
      }}
    >
      <span style={{
        fontFamily: "'Cinzel', serif",
        fontSize: "0.6rem",
        letterSpacing: "0.35em",
        color: "rgba(212,175,55,0.3)",
        textTransform: "uppercase",
        animation: "pulse 1.6s ease-in-out infinite",
      }}>
        Loading…
      </span>
      <style>{`@keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <SubscriptionProvider>
      <KycProvider>
        <Router>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Musée-Crosdale landing */}
                <Route path="/"               element={<Landing />} />
                <Route path="/home"           element={<Home />} />
                <Route path="/about"          element={<About />} />
                <Route path="/gallery"        element={<Gallery />} />
                <Route path="/vaults"         element={<Vaults />} />
                <Route path="/vaults/:vaultId" element={<VaultDetail />} />
                <Route path="/swap"           element={<Swap />} />
                <Route path="/studio"         element={<Studio />} />
                <Route path="/architecture"   element={<Architecture />} />
                <Route path="/legal"          element={<Legal />} />
                <Route path="/xdale"          element={<XdaleGallery />} />
                <Route path="/swapp"          element={<Swapp />} />
                <Route path="/analytics"      element={<Analytics />} />
                <Route path="/kyc"            element={<KycVerify />} />
                <Route path="/dashboard"      element={<Dashboard />} />
                <Route path="/checkout/success"        element={<CheckoutSuccess />} />
                <Route path="/checkout/crypto-success"  element={<CryptoSuccess />} />
                <Route path="/checkout/paypal-success"  element={<PayPalSuccess />} />
                <Route path="/admin"          element={<Admin />} />
                <Route path="*"              element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </KycProvider>
    </SubscriptionProvider>
  );
}
