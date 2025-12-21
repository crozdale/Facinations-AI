
import { GOVERNANCE } from "../config/governance";

export function assertGovernanceAllowed({ account }) {
  if (!account) {
    throw new Error("No connected account");
  }

  const acct = account.toLowerCase();

  if (
    GOVERNANCE.MULTISIG_SAFE &&
    acct === GOVERNANCE.MULTISIG_SAFE.toLowerCase()
  ) {
    return true;
  }

  if (
    Array.isArray(GOVERNANCE.ADMIN_ALLOWLIST) &&
    GOVERNANCE.ADMIN_ALLOWLIST
      .map((a) => a.toLowerCase())
      .includes(acct)
  ) {
    return true;
  }

  throw new Error("Account is not authorized by governance");
}
