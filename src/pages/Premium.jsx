import { useQuery } from "@apollo/client";
import { GET_PREMIUM_USERS } from "@/queries/premiumUsers";

export default function Premium() {
  const { data, loading, error } = useQuery(GET_PREMIUM_USERS);

  if (loading) return <p>Loading premium ledger…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Premium Access Ledger</h1>

      {data.premiumUsers.map(u => (
        <div key={u.id}>
          <p>Address: {u.address}</p>
          <p>Paid: {u.amountPaid.toString()}</p>
          <p>Time: {new Date(Number(u.timestamp) * 1000).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

