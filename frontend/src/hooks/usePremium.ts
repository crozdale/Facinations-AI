import { useQuery } from "@apollo/client";
import { PREMIUM_QUERY } from "../graphql/queries/premium";

export function usePremium(address?: string) {
  const { data } = useQuery(PREMIUM_QUERY, {
    variables: { id: address?.toLowerCase() },
    skip: !address,
  });

  return Boolean(data?.premiumUser);
}
