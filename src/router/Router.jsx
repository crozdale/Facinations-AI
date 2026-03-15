import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home";
import VaultsPage from "../pages/Vaults";
import VaultPage from "../pages/Vault";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vaults" element={<VaultsPage />} />
        <Route path="/vault/:vaultId" element={<VaultPage />} />
      </Routes>
    </BrowserRouter>
  );
}
