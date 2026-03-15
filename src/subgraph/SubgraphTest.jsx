// src/subgraph/SubgraphTest.jsx
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const TEST_SUBGRAPH = gql`
  query FacinationsHealthCheck {
    _meta {
      block {
        number
      }
      deployment
    }
  }
`;

export default function SubgraphTest() {
  const { loading, error, data } = useQuery(TEST_SUBGRAPH);

  if (loading) return <p>Loading subgraph...</p>;

  if (error) {
    return (
      <pre style={{ color: "red" }}>
        Subgraph error:
        {"\n"}
        {error.message}
      </pre>
    );
  }

  if (!data) return <p>No data returned from subgraph.</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

