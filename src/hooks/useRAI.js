import { useCallback, useMemo } from "react";
import { Contract, formatUnits } from "ethers";
import { RAI_CONTRACTS } from "../config/raiContracts";
import { getChainKey } from "../utils/chain";

import VaultABI from "../abi/ArtworkVault.json";
import TreasuryABI from "../abi/XERTreasury.json";
import RaiABI from "../abi/RedeemableArtInstrumentV11.json";
import MinterABI from "../abi/InstrumentMintingManagerV11.json";

function abiOf(json) {
  return json.abi ?? json;
}

export function useRAI({ provider, signer, chainId }) {
  const chainKey = useMemo(() => getChainKey(chainId), [chainId]);
  const addresses = useMemo(() => (chainKey ? RAI_CONTRACTS[chainKey] : null), [chainKey]);

  const readProvider = provider;
  const writeSigner = signer;

  const contracts = useMemo(() => {
    if (!addresses || !readProvider) return null;

    const vault = new Contract(addresses.vault, abiOf(VaultABI), readProvider);
    const treasury = new Contract(addresses.treasury, abiOf(TreasuryABI), readProvider);
    const rai = new Contract(addresses.rai, abiOf(RaiABI), readProvider);
    const minter = new Contract(addresses.minter, abiOf(MinterABI), readProvider);

    const raiWrite = writeSigner ? rai.connect(writeSigner) : null;

    return { vault, treasury, rai, raiWrite, minter, addresses };
  }, [addresses, readProvider, writeSigner]);

  consts: null;

  const getFundingStatus = useCallback(async () => {
    if (!contracts) throw new Error("Contracts not ready");
    const [liability, bal, funded] = await Promise.all([
      contracts.rai.outstandingLiability(),
      contracts.treasury.balance(),
      contracts.rai.isFullyFunded(),
    ]);
    return {
      outstandingLiability: liability,
      treasuryBalance: bal,
      isFullyFunded: funded,
      // formatting helpers (assumes 18 decimals typical for ERC20)
      outstandingLiabilityFmt: formatUnits(liability, 18),
      treasuryBalanceFmt: formatUnits(bal, 18),
    };
  }, [contracts]);

  const listTokenIdsForArtwork = useCallback(
    async (artworkIdBytes32) => {
      if (!contracts) throw new Error("Contracts not ready");
      const tokenIds = await contracts.minter.instrumentsByArtwork(artworkIdBytes32);
      return tokenIds.map((x) => BigInt(x.toString()));
    },
    [contracts]
  );

  const getInstrument = useCallback(
    async (tokenId) => {
      if (!contracts) throw new Error("Contracts not ready");

      // token may be burned; ownerOf will revert
      let owner = null;
      try {
        owner = await contracts.rai.ownerOf(tokenId);
      } catch {
        owner = null;
      }

      let redemptionAmount = 0n;
      let artworkId = null;
      let redeemed = false;

      try {
        redemptionAmount = BigInt((await contracts.rai.redemptionAmount(tokenId)).toString());
        artworkId = await contracts.rai.artworkId(tokenId);
        redeemed = await contracts.rai.isRedeemed(tokenId);
      } catch {
        redeemed = true;
      }

      return {
        tokenId: BigInt(tokenId.toString()),
        owner,
        redemptionAmount,
        redemptionAmountFmt: formatUnits(redemptionAmount, 18),
        artworkId,
        redeemed,
      };
    },
    [contracts]
  );

  const redeem = useCallback(
    async (tokenId) => {
      if (!contracts?.raiWrite) throw new Error("Connect wallet to redeem");
      const tx = await contracts.raiWrite.redeem(tokenId);
      const receipt = await tx.wait();
      return receipt;
    },
    [contracts]
  );

  return {
    chainKey,
    addresses,
    contracts,
    getFundingStatus,
    listTokenIdsForArtwork,
    getInstrument,
    redeem,
  };
}
