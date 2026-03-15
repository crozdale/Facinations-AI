import { useQuery } from "@apollo/client";
import { GET_VAULT } from "../graphql/vault";

export function useVault(id?: string) {
  return useQuery(GET_VAULT, {
    skip: !id,
    variables: { id },
  });
}
