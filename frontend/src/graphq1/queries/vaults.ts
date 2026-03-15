import { gql } from "@apollo/client";

export const VAULTS_QUERY = gql`
  query Vaults {
    vaults(orderBy: createdAt, orderDirection: desc) {
      id
      vaultId
      curator
      isActive
    }
  }
`;
