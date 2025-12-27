import { useEffect, useMemo, useState } from "react";
import { Contract } from "ethers";
import { useWeb3 } from "../providers/Web3Provider";
import { BARTER_ESCROW_ADDRESS } from "../config/swapContracts";

// IMPORTANT: this assumes you have the ABI JSON at this path.
// If your ABI file name differs, change the import line only.
import ESCROW_ABI from "../abi/BarterEscrow.json";

/**
 * Asset types expected by the escrow contract.
 * Mirror these enums in your Solidity:
 * 0 = ERC20, 1 = ERC721, 2 = ERC1155
 */
export const AssetType = {
  ERC20: 0,
  ERC721: 1,
  ERC1155: 2,
};

function toAsset(assetType, token, id, amount) {
  return {
    assetType: Number(assetType),
    token,
    id: BigInt(id || 0),
    amount: BigInt(amount || 0),
  };
}

export function useEscrowSwap() {
  const { provider, account, connect } = useWeb3();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const escrow = useMemo(() => {
    if (!provider) return null;
    if (!BARTER_ESCROW_ADDRESS) return null;
    return new Contract(BARTER_ESCROW_ADDRESS, ESCROW_ABI, provider);
  }, [provider]);

  async function refreshOffers() {
    setError(null);
    if (!escrow) return;

    setLoading(true);
    try {
      // Expect contract has:
      // function offerCount() view returns (uint256)
      // function offers(uint256) view returns (...)
      const count = Number(await escrow.offerCount());

      // Pull last 25 offers (cheap, keeps UI fast)
      const start = Math.max(1, count - 25 + 1);
      const rows = [];

      for (let i = start; i <= count; i++) {
        const o = await escrow.offers(i);
        // Expected struct layout:
        // maker, wantAsset, giveAsset, status (0=Open,1=Accepted,2=Cancelled)
        rows.push({
          id: i,
          maker: o.maker,
          want: o.wantAsset,
          give: o.giveAsset,
          status: Number(o.status),
        });
      }

      rows.reverse(); // newest first
      setOffers(rows);
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escrow]);

  async function createOffer({ give, want }) {
    setError(null);

    if (!provider) await connect();
    if (!BARTER_ESCROW_ADDRESS) {
      throw new Error("Missing VITE_BARTER_ESCROW_ADDRESS");
    }

    const signer = await provider.getSigner();
    const escrowWithSigner = new Contract(
      BARTER_ESCROW_ADDRESS,
      ESCROW_ABI,
      signer
    );

    // Expect contract fn:
    // function createOffer(Asset give, Asset want) returns (uint256 offerId)
    const tx = await escrowWithSigner.createOffer(give, want);
    await tx.wait();
    await refreshOffers();
  }

  async function cancelOffer(offerId) {
    setError(null);

    if (!provider) await connect();
    const signer = await provider.getSigner();
    const escrowWithSigner = new Contract(
      BARTER_ESCROW_ADDRESS,
      ESCROW_ABI,
      signer
    );

    // Expect contract fn: cancelOffer(uint256 offerId)
    const tx = await escrowWithSigner.cancelOffer(offerId);
    await tx.wait();
    await refreshOffers();
  }

  async function acceptOffer(offerId) {
    setError(null);

    if (!provider) await connect();
    const signer = await provider.getSigner();
    const escrowWithSigner = new Contract(
      BARTER_ESCROW_ADDRESS,
      ESCROW_ABI,
      signer
    );

    // Expect contract fn: acceptOffer(uint256 offerId)
    const tx = await escrowWithSigner.acceptOffer(offerId);
    await tx.wait();
    await refreshOffers();
  }

  return {
    account,
    escrowReady: Boolean(escrow),
    offers,
    loading,
    error,
    refreshOffers,
    createOffer,
    cancelOffer,
    acceptOffer,
    toAsset,
    AssetType,
  };
}
