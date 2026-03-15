import { gql } from "@apollo/client";

export const PREMIUM_QUERY = gql`
  query Premium($id: ID!) {
    premiumUser(id: $id) {
      id
      activatedAt
    }
  }
`;
