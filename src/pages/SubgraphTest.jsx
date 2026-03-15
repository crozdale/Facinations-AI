import { useQuery } from "@apollo/client";
import { GET_VAULTS } from "../graphql/queries";

export default function SubgraphTest() {
  const { data, loading, error } = useQuery(GET_VAULTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Vaults</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

