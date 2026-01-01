import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ padding: "2rem", minHeight: "70vh" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
