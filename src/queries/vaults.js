import { gql } from "@apollo/client";

export const GET_VAULTS = gql`
  query GetVaults {
    vaults {
      id
      vaultId
      tokenId
      contractAddress
      legalURI
      active
    }
  }
`;
