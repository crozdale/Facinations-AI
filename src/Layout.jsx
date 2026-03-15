// src/Layout.jsx
export default function Layout({ children }) {
  return (
    <div className="app-shell">
      {/* Temporary shell; replace with your real header/nav later */}
      <header className="app-header">
        
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
}
