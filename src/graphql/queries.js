import { gql } from "@apollo/client";

export const GET_VAULTS = gql`
  query GetVaults {
    vaults(where: { active: true }) {
      id
      vaultId
      tokenId
      legalURI
      contractAddress
    }
  }
`;

export const GET_PREMIUM_USER = gql`
  query GetPremiumUser($address: Bytes!) {
    premiumUsers(where: { address: $address }) {
      id
      amountPaid
      timestamp
    }
  }
`;
