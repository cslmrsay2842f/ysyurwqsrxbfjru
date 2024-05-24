import { BigNumberish } from "ethers/lib/ethers";
import { solidityKeccak256 } from "ethers/lib/utils";

export const hashLeaf = (amount: BigNumberish, account: string) =>
  Buffer.from(
    solidityKeccak256(["uint256", "address"], [amount, account]).slice(2),
    "hex"
  );
