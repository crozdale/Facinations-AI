import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Vaults from "./pages/Vaults";
import Swap from "./pages/Swap";
import Legal from "./pages/Legal";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/vaults" element={<Vaults />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
    </>
  );
}
