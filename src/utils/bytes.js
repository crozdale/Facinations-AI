import { keccak256, toUtf8Bytes } from "ethers";

/**
 * Make a deterministic bytes32 artworkId from a human string.
 * Example input: "xdale:untitled-study-1" or "xdale:COLLECTION:1234"
 */
export function artworkIdFromString(str) {
  return keccak256(toUtf8Bytes(str));
}
