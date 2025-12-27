import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/swap">Swap</Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
