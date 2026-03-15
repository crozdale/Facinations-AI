import { gql, useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const VAULTS_QUERY = gql`
  query FacinationsVaults {
    vaults(first: 10, orderBy: createdAt, orderDirection: desc) {
      id
      owner
      name
      tokenCount
    }
  }
`;

export default function SubgraphVaults() {
  const { loading, error, data } = useQuery(VAULTS_QUERY);

  if (loading) return <p>Loading vaults...</p>;
  if (error) return <pre style={{ color: "red" }}>{error.message}</pre>;
  if (!data || !data.vaults.length) return <p>No vaults indexed yet.</p>;

  return (
    <ul>
      {data.vaults.map((vault) => (
        <li key={vault.id}>
          {vault.name ?? vault.id} — owner: {vault.owner} — tokens: {vault.tokenCount}
        </li>
      ))}
    </ul>
  );
}
