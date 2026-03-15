import { useQuery } from "@apollo/client";
import { VAULTS_QUERY } from "../graphql/queries/vaults";

export function useVaults() {
  const { data, loading, error } = useQuery(VAULTS_QUERY);
  return {
    vaults: data?.vaults ?? [],
    loading,
    error,
  };
}
