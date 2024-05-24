import { formatEther, parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

async function main() {
  const [Deployer] = await ethers.getSigners();

  const MyShell = await ethers.getContract("MyShell", Deployer);
  const Airdrop = await ethers.getContract("Airdrop", Deployer);

  await MyShell.connect(Deployer).transfer(
    Airdrop.address,
    parseEther("20000")
  );

  console.log("deployer balance", formatEther(await Deployer.getBalance()));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
