import { FEATURES } from "../config/featureFlags";
import { NETWORKS } from "../config/networks";
import { assertGovernanceAllowed } from "./governanceGuard";

export function assertVaultWriteAllowed({ chainId, account }) {
  if (FEATURES.VAULT_WRITE_ENABLED !== true) {
    throw new Error("Vault write paths are disabled by feature flag");
  }

  if (Number(chainId) !== Number(NETWORKS.ethereum.chainId)) {
    throw new Error("Wrong network for vault write operation");
  }

  assertGovernanceAllowed({ account });

  return true;
}
