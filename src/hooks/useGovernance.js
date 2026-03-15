import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { GOVERNANCE_ABI } from "../contracts/Governance";
import { useChain } from "./useChain";

export function useGovernance() {
  const [roles, setRoles] = useState({
    governor: false,
    emergency: false
  });

  const chainId = useChain();

  useEffect(() => {
    async function load() {
      if (!window.ethereum || !chainId) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const governance = new ethers.Contract(
        import.meta.env[`VITE_GOVERNANCE_${chainId}`],
        GOVERNANCE_ABI,
        provider
      );

      const governor = await governance.isGovernor(address);
      const emergency = await governance.isEmergency(address);

      setRoles({ governor, emergency });
    }

    load();
  }, [chainId]);

  return roles;
}
