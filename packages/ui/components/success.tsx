import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  Text,
  Link,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";

import ButtonComponent from "./buttonComponent";

const Success = ({ amount, txHash }: { amount: string; txHash: string }) => {
  const { onClose } = useDisclosure();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        onClose();
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        maxW="640px"
        maxH="480px"
        width="640px"
        height="480px"
        flexShrink={0}
        overflow="hidden"
        borderRadius="42px"
        boxShadow="0px 32px 64px 0px rgba(0, 0, 0, 0.08)"
      >
        <ModalBody gap="16px" padding="0">
          <Image
            src="/success_claim_image.png"
            alt=""
            width="640px"
            height="280px"
            borderRadius="42px 42px 0px 0px"
            alignItems="center"
            mt="auto"
          />
          <Text
            mt="16px"
            // gap="16px"
            color="#24295A"
            textAlign="center"
            fontSize="24px"
            fontStyle="normal"
            fontWeight="400"
            lineHeight="100%"
            textTransform="uppercase"
          >
            CONGRATULATIONS
          </Text>
          <Text
            mt="10px"
            color="#24295A"
            textAlign="center"
            fontSize="14px"
            fontStyle="normal"
            fontWeight="400"
            lineHeight="normal"
            whiteSpace="nowrap"
          >
            You have successfully claimed your{" "}
            {Number(amount.substring(0, amount.length - 18)).toLocaleString()}{" "}
            $SHELL
          </Text>

          <Flex justifyContent="center" mt="10px" fontSize="12px">
            <Link
              href={`https://${
                process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
                  ? ""
                  : "sepolia."
              }etherscan.io/tx/${txHash}`}
              isExternal
            >
              View Transaction on Explorer
              <ExternalLinkIcon mx="2px" />
            </Link>
          </Flex>

          <Flex flexDirection="column" mt="16px">
            <ButtonComponent
              type="Done"
              enable
              buttonName="Finish"
              onClick={() => {
                setIsOpen(false);
                onClose();
              }}
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default Success;
