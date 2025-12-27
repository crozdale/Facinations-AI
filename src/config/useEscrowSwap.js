import { useEffect, useMemo, useState } from "react";
import { Contract } from "ethers";
import { useWeb3 } from "../providers/Web3Provider";
import { BARTER_ESCROW_ADDRESS } from "../config/swapContracts";
import ESCROW_ABI from "../abi/BarterEscrow.json";

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

  const escrow = useMemo(() => {
    if (!provider || !BARTER_ESCROW_ADDRESS) return null;
    return new Contract(BARTER_ESCROW_ADDRESS, ESCROW_ABI, provider);
  }, [provider]);

  async function refreshOffers() {
    if (!escrow) return;
    setLoading(true);

    const count = Number(await escrow.nextOfferId());
    const rows = [];

    for (let i = 0; i < count; i++) {
      const o = await escrow.offers(i);
      if (o.active) {
        rows.push({
          id: i,
          maker: o.maker,
          give: o.giveAsset,
          want: o.wantAsset,
        });
      }
    }

    setOffers(rows.reverse());
    setLoading(false);
  }

  useEffect(() => {
    refreshOffers();
  }, [escrow]);

  async function createOffer(give, want) {
    if (!provider) await connect();
    const signer = await provider.getSigner();
    const c = escrow.connect(signer);
    const tx = await c.createOffer(give, want);
    await tx.wait();
    refreshOffers();
  }

  async function acceptOffer(id) {
    if (!provider) await connect();
    const signer = await provider.getSigner();
    const c = escrow.connect(signer);
    const tx = await c.acceptOffer(id);
    await tx.wait();
    refreshOffers();
  }

  async function cancelOffer(id) {
    if (!provider) await connect();
    const signer = await provider.getSigner();
    const c = escrow.connect(signer);
    const tx = await c.cancelOffer(id);
    await tx.wait();
    refreshOffers();
  }

  return {
    account,
    offers,
    loading,
    createOffer,
    acceptOffer,
    cancelOffer,
    toAsset,
    AssetType,
  };
}
