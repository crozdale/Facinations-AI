import { useQuery } from "@apollo/client";
import { GET_SWAPS } from "../graphql/swaps";

export function useSwaps(vaultId?: string) {
  return useQuery(GET_SWAPS, {
    skip: !vaultId,
    variables: { vaultId },
  });
}
