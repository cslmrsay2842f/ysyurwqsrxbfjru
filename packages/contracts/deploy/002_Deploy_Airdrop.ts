// import { parseEther } from "ethers/lib/utils";
// import { ethers } from "hardhat";
import { keccak256, parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import MerkleTree from "merkletreejs";

import { hashLeaf } from "../helpers";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;

  const { deployer } = await getNamedAccounts();

  // test tree data
  const claimAmount = parseEther("420");
  const signers = [
    "0x12EAD0881793314D63B6BACE59Ee5F827971e27A",
    deployer,
    "0x6076c1f3Be35962A88B1d76978fb2be10d684092",
    "0x4102f86aC51B037F80fD13f7e5651e00b959a96e",
  ];

  // create the merkle tree leafs
  const leafs = signers.map((signer) => hashLeaf(claimAmount, signer));
  // create the tree
  const merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });

  // get our token contract address
  const MyShell = await ethers.getContract("MyShell", deployer);

  await deploy("Airdrop", {
    contract: "Airdrop",
    from: deployer,
    args: [
      `0x${merkleTree.getRoot().toString("hex")}`,
      MyShell.address,
      deployer,
    ],
    log: true,
    autoMine: true,
  });
};

export default func;
func.tags = ["testbed", "_airdrop"];
