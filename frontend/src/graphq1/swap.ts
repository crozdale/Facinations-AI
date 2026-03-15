import { gql } from "@apollo/client";

export const GET_SWAPS = gql`
  query GetSwaps($vaultId: String!) {
    swaps(where: { id_contains: $vaultId }, orderBy: timestamp, orderDirection: desc) {
      id
      user
      amountIn
      amountOut
      timestamp
    }
  }
`;
