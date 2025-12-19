import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Vault from "./pages/Vault";
import Swap from "./pages/Swap";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/swap" element={<Swap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
