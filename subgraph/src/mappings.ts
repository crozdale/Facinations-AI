import { BigInt } from "@graphprotocol/graph-ts";
import { SwapExecuted } from "../generated/FacinationsVaultDeFi/FacinationsVaultDeFi";
import { Swap, SwapUser } from "../generated/schema";

export function handleSwapExecuted(event: SwapExecuted): void {
  let swap = new Swap(event.transaction.hash.toHex());
  swap.user      = event.params.user;
  swap.tokenOut  = event.params.tokenOut;
  swap.amountIn  = event.params.amountIn;
  swap.feePaid   = event.params.feePaid;
  swap.amountOut = event.params.amountOut;
  swap.timestamp = event.params.timestamp;
  swap.blockNumber = event.block.number;
  swap.save();

  let userId = event.params.user.toHex();
  let user = SwapUser.load(userId);

  if (!user) {
    user = new SwapUser(userId);
    user.totalSwaps    = BigInt.fromI32(0);
    user.totalXerIn    = BigInt.fromI32(0);
    user.totalFeesPaid = BigInt.fromI32(0);
    user.lastSwapAt    = BigInt.fromI32(0);
  }

  user.totalSwaps    = user.totalSwaps.plus(BigInt.fromI32(1));
  user.totalXerIn    = user.totalXerIn.plus(event.params.amountIn);
  user.totalFeesPaid = user.totalFeesPaid.plus(event.params.feePaid);
  user.lastSwapAt    = event.params.timestamp;
  user.save();
}