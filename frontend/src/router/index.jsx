import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Vault from "../pages/Vault";
import Governance from "../pages/Governance";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vault/:id" element={<Vault />} />
        <Route path="/governance" element={<Governance />} />
      </Routes>
    </BrowserRouter>
  );
}
