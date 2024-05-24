import { ethers } from "hardhat";

async function main() {
  const [Deployer] = await ethers.getSigners();

  const Airdrop = await ethers.getContract("Airdrop", Deployer);

  const blockTime = (await ethers.provider.getBlock("latest")).timestamp;
  await Airdrop.setUnlockTime(blockTime);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
