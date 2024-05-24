import { readFileSync } from "fs";
import path from "path";

import {
  createSmartAccountClient,
  IPaymaster,
  PaymasterMode,
  createPaymaster,
} from "@biconomy/account";
import AirdropContract from "@scope/contracts/deployments/sepolia/Airdrop.json";
import { Airdrop } from "@scope/contracts/typechain-types";
import { apiHandler, sponsorResponse, sponsorRequestSchema } from "@scope/lib";
import { JsonRpcProvider, Wallet, Contract } from "ethers";
import { NextApiRequest, NextApiResponse } from "next/types";

import { isTest } from "@/constants";

interface ChainSettings {
  chainId: number;
  paymasterURL: string;
  bundlerUrl: string;
  rpcUrl: string;
  privateKey: string;
}

const chainSettings: ChainSettings = isTest
  ? {
      chainId: 11155111,
      paymasterURL: `https://paymaster.biconomy.io/api/v1/11155111/${process.env.PAYMASTER_API_KEY}`,
      bundlerUrl: `https://bundler.biconomy.io/api/v2/${11155111}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
      rpcUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      privateKey: process.env.PRIVATE_KEY!,
    }
  : // TODO all mainnet values here are bogus
    {
      chainId: 1,
      paymasterURL: "",
      bundlerUrl: `https://bundler.biconomy.io/api/v2/${1}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
      rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      privateKey: process.env.PRIVATE_KEY!,
    };

interface AirdropData {
  address: string;
  amount: string;
  proof: string[];
  isSponsored: boolean;
}

export default apiHandler().post(
  async (req: NextApiRequest, res: NextApiResponse<sponsorResponse>) => {
    const { address } = sponsorRequestSchema.parse(req.body);

    // TODO change back to this when in a bucket
    // get the address merkle details from our bucket
    // const { data } = (await axios.get(`/merkles/${address}.json`)) as {
    //   data: AirdropData;
    // };

    // console.log(data);

    const file = path.join(process.cwd(), `public/merkles/${address}.json`);
    const stringified = readFileSync(file);
    const data = JSON.parse(stringified.toString()) as AirdropData;

    // if the merkle record is not sponsored, throw a 401
    if (!data.isSponsored)
      return res.status(401).send({ result: "get outta here, crook" });

    const provider = new JsonRpcProvider(chainSettings.rpcUrl);
    const signer = new Wallet(chainSettings.privateKey, provider);

    const paymaster: IPaymaster = await createPaymaster({
      paymasterUrl: chainSettings.paymasterURL,
      strictMode: true,
    });

    const biconomySmartAccount = await createSmartAccountClient({
      signer,
      chainId: chainSettings.chainId,
      paymaster,
      bundlerUrl: chainSettings.bundlerUrl,
    });

    const claimAmount = data.amount;
    const { proof } = data;

    const airdrop = new Contract(
      AirdropContract.address,
      AirdropContract.abi,
      signer
    ) as unknown as Airdrop;

    // @ts-ignore - this is so stupid, don't know why this throws an error as it does work
    const txDetails = await airdrop.redeem.populateTransaction(
      address,
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

    return res.status(200).send({ result: transactionHash! });
  }
);
