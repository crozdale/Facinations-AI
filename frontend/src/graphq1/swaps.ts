import { gql } from "@apollo/client";

export const GET_SWAPS = gql`
  query GetSwaps($vault: Bytes!) {
    swaps(where: { id_contains: $vault }) {
      user
      amountIn
      amountOut
      timestamp
    }
  }
`;
