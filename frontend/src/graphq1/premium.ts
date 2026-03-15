import { gql } from "@apollo/client";

export const GET_PREMIUM = gql`
  query Premium($id: ID!) {
    premiumUser(id: $id) {
      id
      activatedAt
    }
  }
`;
