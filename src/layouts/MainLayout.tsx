import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MainLayout() {
  const { t } = useTranslation();
  return (
    <>
      <header>
        <nav>
          <Link to="/">{t("mainLayout.home")}</Link>
          <Link to="/swap">{t("mainLayout.swap")}</Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
