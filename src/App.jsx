import Header from "./components/Header";
import Swap from "./pages/Swap";
import Footer from "./components/Footer";
import "./styles/theme.css";

export default function App() {
  return (
    <>
      <Header />
      <main className="app-container">
        <Swap />
      </main>
      <Footer />
    </>
  );
}
