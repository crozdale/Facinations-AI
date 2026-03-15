// src/components/AppLayout.jsx
import Layout from "./Layout.jsx";
import React from "react";

export default function AppLayout({ children }: { children?: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}
