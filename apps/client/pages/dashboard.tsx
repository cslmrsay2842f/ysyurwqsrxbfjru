import { ChakraProvider, Flex, Spinner, useToast } from "@chakra-ui/react";
import { useWallets } from "@privy-io/react-auth";
import { Airdrop } from "@scope/contracts/typechain-types";
import { sponsorResponse } from "@scope/lib/api/schema/sponsor";
import Eligibility from "@scope/ui/components/eligibility";
import Notification from "@scope/ui/components/notification";
import Success from "@scope/ui/components/success";
import Timer from "@scope/ui/components/timer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Contract, JsonRpcProvider } from "ethers";
import { NextPage } from "next";
import { useState } from "react";
import ReactConfetti from "react-confetti";

import { AirdropDeployment, isTest } from "@/constants";
import { hashLeaf } from "@/helpers";
import { useTaskStore } from "@/stores";

interface AirdropData {
  address: string;
  amount?: string;
  proof: string[];
  isSponsored: boolean;
  isClaimedAlready: boolean;
}

const fetchAirdropDetails = async (address: string): Promise<AirdropData> => {
  try {
    // TODO readd `${bucketURL()} here
    const response = await axios.get(`/merkles/${address}.json`);

    const provider = new JsonRpcProvider(
      `https://${isTest ? "sepolia." : "mainnet."}infura.io/v3/${
        process.env.NEXT_PUBLIC_INFURA_API_KEY
      }`
    );
    const airdrop = new Contract(
      AirdropDeployment.address,
      AirdropDeployment.abi,
      provider
    ) as unknown as Airdrop;

    const leaf = hashLeaf(response.data.amount, address);
    const isClaimedAlready = await airdrop.usedClaims(leaf);
    return { ...response.data, isClaimedAlready };
  } catch (error) {
    console.error("Error fetching airdrop details:", error);
    return {
      isClaimedAlready: false,
      address,
      isSponsored: false,
      proof: [],
    };
  }
};

const DashboardPage: NextPage = () => {
  const { wallets } = useWallets();
  const address = wallets[0];

  const { data: airdropData, isLoading } = useQuery<AirdropData>(
    ["airdropDetails", address],
    () => fetchAirdropDetails(address.address),
    {
      enabled: !!address,
    }
  );

  const { tasks, addTask } = useTaskStore();
  const toast = useToast();

  const [successfulClaim, setSuccessfulClaim] = useState(false);

  const submitClaim = async () => {
    if (!airdropData) return;
    if (airdropData.isClaimedAlready) throw new Error("Already Claimed!");

    try {
      // if it's sponsored, go straight to our backend
      if (airdropData.isSponsored) {
        const sponsored = await axios.post<sponsorResponse>("/api/submit", {
          address: address.address,
        });
        // TODO save this to zustand
        console.log(sponsored);
        addTask(address.address, sponsored.data.result);
      } else {
        const airdrop = new Contract(
          AirdropDeployment.address,
          AirdropDeployment.abi
        ) as unknown as Airdrop;

        // @ts-ignore
        const tx = await airdrop.redeem.populateTransaction(
          address.address,
          airdropData?.amount,
          airdropData?.proof
        );

        const transactionRequest = {
          to: AirdropDeployment.address,
          from: address.address,
          data: tx.data,
        };

        const provider = await address.getEthereumProvider();

        const transactionHash = await provider.request({
          method: "eth_sendTransaction",
          params: [transactionRequest],
        });

        // TODO save this to zustand
        toast({
          title: "Tokens Claimed! 🎉",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        addTask(address.address, transactionHash);
      }
      setSuccessfulClaim(true);
    } catch (err) {
      toast({
        title: "Error Claiming Tokens 😢",
        description: "Try again or reach out to the MyShell team",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      throw err;
    }
  };

  // TODO make this better
  const chainToBeOn = isTest ? "Ethereum Sepolia" : "Ethereum Mainnet";
  const wrongNetwork = wallets[0]?.chainId === "eip155:1";

  return (
    // TODO I had to add this ChakraProvider to get it to work??
    <ChakraProvider>
      <Flex
        p="20px"
        justifyContent="center"
        alignItems="center"
        h="100vh"
        flexDirection="column"
      >
        {isLoading && <Spinner size="xl" height="50px" width="50px" />}

        {wrongNetwork && (
          <Notification message={`Please change to ${chainToBeOn}.`} />
        )}

        {!isLoading && airdropData && (
          // TODO refactor this to just accept airdrop data as a type
          <Eligibility
            address={address.address}
            isSponsored={airdropData.isSponsored}
            eligible={!!airdropData?.amount}
            amount={airdropData?.amount ?? "0"}
            redeem={submitClaim}
            isClaimedAlready={
              (airdropData?.isClaimedAlready || successfulClaim) ?? true
            }
            tasks={tasks}
          />
        )}

        {successfulClaim && airdropData?.amount && <ReactConfetti /> && (
          <Success
            amount={airdropData?.amount!}
            txHash={tasks.find((t) => t.key === address.address)?.value!}
          />
        )}

        {!successfulClaim && !isLoading && !successfulClaim && <Timer />}
      </Flex>
    </ChakraProvider>
  );
};
export default DashboardPage;
