import {
  createSmartAccountClient,
  IPaymaster,
  PaymasterMode,
  createPaymaster,
} from "@biconomy/account";
import { keccak256, parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import MerkleTree from "merkletreejs";

import { hashLeaf } from "../helpers";
import { Airdrop } from "../typechain-types";

const claimAmount = parseEther("420");

async function main() {
  const [Deployer] = await ethers.getSigners();

  const signers = [
    "0x12EAD0881793314D63B6BACE59Ee5F827971e27A",
    Deployer.address,
    "0x6076c1f3Be35962A88B1d76978fb2be10d684092",
    "0x4102f86aC51B037F80fD13f7e5651e00b959a96e",
  ];

  const paymasterURL = `https://paymaster.biconomy.io/api/v1/11155111/${process.env.PAYMASTER_API_KEY}`;

  const chainId = 11155111;
  const bundlerUrl = `https://bundler.biconomy.io/api/v2/${chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`; // this is public bundler url

  const config = {
    privateKey: process.env.PRIVATE_KEY!,
    bundlerUrl: paymasterURL, // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
    rpcUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
  };

  const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
  const signer = new ethers.Wallet(config.privateKey, provider);

  const paymaster: IPaymaster = await createPaymaster({
    paymasterUrl: paymasterURL,
    strictMode: true,
  });

  const biconomySmartAccount = await createSmartAccountClient({
    signer,
    chainId: 11155111,
    paymaster,
    bundlerUrl,
  });

  // generate our contract arguments
  const claimerNumber = 1;
  const leafs = signers.map((iSigner) => hashLeaf(claimAmount, iSigner));
  const merkleTree = new MerkleTree(leafs, keccak256, { sortPairs: true });
  const proof = merkleTree.getHexProof(leafs[claimerNumber]);
  const airdrop = (await ethers.getContract("Airdrop", Deployer)) as Airdrop;
  const txDetails = await airdrop.populateTransaction.redeem(
    signers[claimerNumber],
    claimAmount,
    proof
  );

  if (!txDetails.to || !txDetails.data) throw new Error("Invalid tx details");

  const tx = {
    to: txDetails.to,
    data: txDetails.data,
  };

  // Send the transaction and get the transaction hash
  const userOpResponse = await biconomySmartAccount.sendTransaction(tx, {
    paymasterServiceData: { mode: PaymasterMode.SPONSORED },
  });
  const { transactionHash } = await userOpResponse.waitForTxHash();
  console.log("tx: ", transactionHash);

  // wait til it goes through
  const userOpReceipt = await userOpResponse.wait();
  if (userOpReceipt.success === "true") {
    console.log("Transaction receipt", userOpReceipt.receipt);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
