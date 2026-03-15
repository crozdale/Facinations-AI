import { gql } from "@apollo/client";

export const GET_VAULT = gql`
  query GetVault($id: ID!) {
    vault(id: $id) {
      id
      vaultId
      vaultContract
      swapContract
      premiumRequired
    }
  }
`;
