import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Divider, Flex, Link, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";

import ButtonComponent from "./buttonComponent";

const ClaimDialog = ({
  amount,
  isSponsored,
}: {
  amount: string;
  isSponsored: boolean;
}) => (
  <>
    <Text
      fontSize="24px"
      fontWeight={400}
      lineHeight="24px"
      fontStyle="normal"
      textAlign="center"
      textTransform="uppercase"
      color="#24295A"
    >
      CONGRATULATIONS,
    </Text>
    <Text
      fontSize="24px"
      fontWeight={400}
      lineHeight="24px"
      fontStyle="normal"
      textAlign="center"
      textTransform="uppercase"
      color="#24295A"
    >
      You&apos;re eligible to Claim:
    </Text>

    <Flex alignItems="center" justifyContent="center" p="16px">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="122"
        viewBox="0 0 17 122"
        fill="none"
      >
        <path d="M17 1H1V121H17" stroke="#24295A" />
      </svg>
      <Text
        fontSize="64px"
        padding="16px 32px"
        fontWeight={400}
        lineHeight="76.32px"
        textAlign="center"
        color="#24295A"
      >
        {amount
          ? Number(amount.substring(0, amount.length - 18)).toLocaleString()
          : 0}{" "}
        $SHELL
      </Text>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="122"
        viewBox="0 0 17 122"
        fill="none"
      >
        <path d="M-2.38419e-07 1H16V121H-2.38419e-07" stroke="#24295A" />
      </svg>
    </Flex>

    {isSponsored && (
      <Flex direction="column">
        <Text
          fontSize="15px"
          fontWeight={800}
          fontFamily="PP Telegraf"
          lineHeight="24px"
          fontStyle="normal"
          textAlign="center"
          textTransform="uppercase"
          color="#24295A"
        >
          No gas fees for you - your transaction will be sponsored by the
          MyShell team.
        </Text>
      </Flex>
    )}
  </>
);

const AlreadyClaimedDialog = ({ txHash }: { txHash?: string }) => (
  <>
    <Text
      fontSize="24px"
      fontWeight={400}
      lineHeight="24px"
      fontStyle="normal"
      textAlign="center"
      textTransform="uppercase"
      color="#24295A"
    >
      You&apos;ve already claimed your $SHELL allocation.
    </Text>

    <Link
      href={`https://${
        process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "" : "sepolia."
      }etherscan.io/tx/${txHash}`}
      isExternal
    >
      View on Explorer
      <ExternalLinkIcon mx="2px" />
    </Link>
  </>
);

const NotEligibleDialog = () => (
  <>
    <Text
      fontSize="62px"
      fontFamily="PP Telegraf"
      fontWeight={400}
      lineHeight="72px"
      textAlign="center"
      color="#24295A"
    >
      SORRY, YOU ARE NOT ELIGIBLE.
    </Text>
    <Text
      fontSize="24px"
      fontWeight={400}
      lineHeight="24px"
      textAlign="center"
      color="#24295A"
      fontFamily="PP Telegraf"
    >
      Check eligibility Criteria
    </Text>
  </>
);

export interface TaskState {
  key: string;
  value: string;
}

const Eligibility = ({
  eligible,
  amount,
  redeem,
  address,
  isClaimedAlready,
  isSponsored,
  tasks,
}: {
  eligible: boolean;
  amount: string;
  redeem: () => Promise<void>;
  address: string;
  isClaimedAlready: boolean;
  isSponsored: boolean;
  tasks: TaskState[];
}) => {
  const [loading, setLoading] = useState(false);
  const [buttonName, setButtonName] = useState("Claim");

  const handleClaimClick = useCallback(async () => {
    try {
      setLoading(true);
      await redeem();
      setButtonName("Claimed");
    } catch (err) {
      // handle error scenario
      console.error(err);
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  }, [redeem]);

  return (
    <Flex direction="column" alignItems="center" gap="16px">
      {eligible && !isClaimedAlready && (
        <ClaimDialog amount={amount} isSponsored={isSponsored} />
      )}

      {isClaimedAlready && (
        <AlreadyClaimedDialog
          txHash={tasks.find((t) => t.key === address)?.value}
        />
      )}
      {!eligible && <NotEligibleDialog />}

      {!isClaimedAlready ? (
        <>
          <ButtonComponent
            type="claim"
            buttonName={buttonName}
            enable={eligible}
            onClick={handleClaimClick}
            loading={loading}
          />

          <Divider
            orientation="vertical"
            w="0"
            h="128px"
            opacity="0.5"
            borderWidth="1px"
            borderColor="#0_a00000"
            transform="rotate(180deg)"
          />
        </>
      ) : (
        <Box height="128px" />
      )}
    </Flex>
  );
};

export default Eligibility;
