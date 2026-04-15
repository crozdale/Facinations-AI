import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { GET_PREMIUM_USERS } from "@/queries/premiumUsers";

export default function Premium() {
  const { t } = useTranslation();
  const { data, loading, error } = useQuery(GET_PREMIUM_USERS);

  if (loading) return <p>Loading premium ledger…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>{t("premium.ledger_title")}</h1>

      {data.premiumUsers.map(u => (
        <div key={u.id}>
          <p>{t("premium.address")} {u.address}</p>
          <p>{t("premium.paid")} {u.amountPaid.toString()}</p>
          <p>{t("premium.time")} {new Date(Number(u.timestamp) * 1000).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

