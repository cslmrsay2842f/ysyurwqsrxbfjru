import { BigNumberish, solidityPackedKeccak256 } from "ethers";

import { AirdropDeployment, isTest } from "@/constants";

export const hashLeaf = (amount: BigNumberish, account: string) =>
  Buffer.from(
    solidityPackedKeccak256(["uint256", "address"], [amount, account]).slice(2),
    "hex"
  );

export const getBlockExplorerURL = () =>
  isTest ? "https://sepolia.etherscan.io/" : "https://etherscan.io/";

// if we have the transaction hash - use it, otherwise send the user to the filtered by holders page in the
// block explorer
export const getTxBlockExplorerURL = (address: string, txHash?: string) => {
  const base = getBlockExplorerURL();

  if (txHash) {
    return `${base}/tx/${txHash}`;
  }

  return `${base}/token/${AirdropDeployment.address}?a=${address}`;
};
