import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import { graphClient } from "./graphql/client";
import "./i18n";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={graphClient}>
      <Suspense fallback={<div style={{ background: "#000", color: "#d4af37", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</div>}>
        <App />
      </Suspense>
    </ApolloProvider>
  </React.StrictMode>
);
