import fs from "fs";
import path from "path";

import { keccak256, parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import MerkleTree from "merkletreejs";

import { hashLeaf } from "../helpers";
import { Airdrop } from "../typechain-types";

interface TestCase {
  address: string;
  isSponsored: boolean;
  privateKey?: string;
}

const testCircumstance: TestCase[] = [
  // RANDOMLY GENERATED ADDRESSES
  // 3 SPONSORED
  {
    address: "0x51404Ab551A6510CFD70ea1e94516c7BfA1ea782",
    isSponsored: true,
  },
  {
    address: "0x245A373CF19e1e1d4A8b958f5530889D5bEEb89d",
    isSponsored: true,
  },
  {
    address: "0x4e41C6B2DB25EfeB950461F59e8693385ca59075",
    isSponsored: true,
  },
  // 3 NOT SPONSORED
  {
    address: "0x75054AB5262686db68357465A4009FCb44687D62",
    isSponsored: false,
  },
  {
    address: "0x346558c421416704ED17A2D072040f0E5F63B724",
    isSponsored: false,
  },
  {
    address: "0xBDcF2DB52536c8208E9ce50F81A833A1AF1542fE",
    isSponsored: false,
  },
  // BEN SPONSORED
  {
    address: "0x77224daA67C18FC643B852f873F6365fad5f4CEA",
    isSponsored: true,
  },
  // BEN UNSPONSORED (g t in mm)
  {
    address: "0x17Bb71eBa210aE96634f93C5666b6EEFD9587DC8",
    isSponsored: false,
  },
  // EMILIO
  {
    address: "0x70536E0de21f79a303b7d96bc738BCB6A61Ca8c6",
    isSponsored: true,
  },
  // CHAMI
  {
    address: "0x9Bc7F7aAfd923E25e90d7cf32A57397BD6C296f7",
    isSponsored: false,
  },
  // LUKE
  {
    address: "0x4102f86aC51B037F80fD13f7e5651e00b959a96e",
    isSponsored: true,
  },
];

const claimAmount = parseEther("151");

async function main() {
  const [Deployer] = await ethers.getSigners();

  const leafs = testCircumstance.map((signer) =>
    hashLeaf(claimAmount, signer.address)
  );

  const merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });

  const filePath = `${path.dirname("")}./../apps/client/public/merkles/`;

  if (fs.existsSync(filePath)) {
    fs.rmdirSync(filePath, {
      recursive: true,
    });
  }

  fs.mkdirSync(filePath);

  // eslint-disable-next-line array-callback-return -- handy for testing
  const promises = leafs.map((leaf, i) => {
    const current = merkleTree.getHexProof(leaf);

    const equals = hashLeaf(claimAmount, testCircumstance[i].address);

    // QA check
    if (leaf.toString() !== equals.toString()) {
      throw new Error("Logic Wrong");
    }

    fs.writeFileSync(
      `${filePath}${testCircumstance[i].address}.json`,
      JSON.stringify({
        address: testCircumstance[i].address,
        amount: claimAmount.toString(),
        isSponsored: testCircumstance[i].isSponsored,
        proof: current,
      })
    );
  });

  await Promise.all(promises);

  const newRoot = `0x${merkleTree.getRoot().toString("hex")}`;
  const airdrop = (await ethers.getContract("Airdrop", Deployer)) as Airdrop;

  await airdrop.setRoot(newRoot);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
