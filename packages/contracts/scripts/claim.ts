import { keccak256, parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import MerkleTree from "merkletreejs";

import { hashLeaf } from "../helpers";
import { Airdrop } from "../typechain-types";

async function main() {
  const [Deployer] = await ethers.getSigners();

  const airdrop = (await ethers.getContract("Airdrop", Deployer)) as Airdrop;

  const claimAmount = parseEther("420");
  const signers = [
    "0x12EAD0881793314D63B6BACE59Ee5F827971e27A",
    Deployer.address,
    "0x6076c1f3Be35962A88B1d76978fb2be10d684092",
    "0x4102f86aC51B037F80fD13f7e5651e00b959a96e",
  ];

  const leafs = signers.map((signer) => hashLeaf(claimAmount, signer));

  const merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });

  const proof = merkleTree.getHexProof(leafs[0]);

  const tx = await airdrop.redeem(signers[0], claimAmount, proof);

  console.log(tx);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
