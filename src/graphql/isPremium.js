import { gql } from "@apollo/client";

export const IS_PREMIUM = gql`
  query IsPremium($id: ID!) {
    premiumUser(id: $id) {
      id
      amountPaid
      timestamp
    }
  }
`;

