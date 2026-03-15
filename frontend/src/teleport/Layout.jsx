import HeaderBridge from "../components/HeaderBridge";

export default function Layout({ children }) {
  return (
    <div>
      <HeaderBridge />
      <main>{children}</main>
    </div>
  );
}
