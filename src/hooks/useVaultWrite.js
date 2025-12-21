import { Contract } from "ethers";
import { useWeb3 } from "../providers/Web3Provider";
import VAULT_WRITE_ABI from "../abi/VaultWrite.json";
import { assertVaultWriteAllowed } from "../guards/vaultWriteGuard";

export function useVaultWrite(vaultAddress) {
  const { provider, account, chainId } = useWeb3();

  function getSignerContract() {
    if (!provider || !account || !vaultAddress) return null;
    const signer = provider.getSigner();
    return new Contract(vaultAddress, VAULT_WRITE_ABI, signer);
  }

  async function mint() {
    assertVaultWriteAllowed({ chainId, account });
    const contract = getSignerContract();
    if (!contract) {
      throw new Error("Wallet or contract not ready");
    }
    const tx = await contract.mint();
    return await tx.wait();
  }

  async function redeem(amount) {
    assertVaultWriteAllowed({ chainId, account });
    const contract = getSignerContract();
    if (!contract) {
      throw new Error("Wallet or contract not ready");
    }
    const tx = await contract.redeem(amount);
    return await tx.wait();
  }

  return {
    mint,
    redeem,
  };
}
