import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";

import { Rules } from "./rules";

const Criteria = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const rulesMap = Rules().getMap();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        maxW="1068px"
        maxH="980px"
        width="1068px"
        height="980px"
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundImage="/MyShell_Claim_NFT_Card.png"
        borderRadius="42px"
        backgroundRepeat="no-repeat"
      >
        <ModalHeader
          alignSelf="stretch"
          color="#24295A"
          fontFamily="PP Telegraf"
          fontSize="32px"
          fontStyle="normal"
          padding="64px 64px 0px 64px"
          fontWeight="400"
          lineHeight="100%" /* 32px */
          textTransform="uppercase"
        >
          Eligibility criteria
        </ModalHeader>
        <ModalCloseButton position="absolute" top="24px" right="24px" />

        <ModalBody padding="24px 124px 64px 60px">
          <Table>
            <Tbody>
              <Tr>
                <Td borderBottom="1px solid #cdddf2" colSpan={2} />
              </Tr>
              {Array.from(rulesMap.entries()).map(([key, value], index) => (
                <Tr key={key}>
                  <Td
                    padding="32px 0px"
                    width="96px"
                    color="#000"
                    fontFamily="PP Telegraf"
                    fontSize="20px"
                    fontStyle="normal"
                    fontWeight="400"
                    lineHeight="normal"
                    textAlign="left"
                    borderBottom={
                      index < rulesMap.size - 1 ? "1px solid #cdddf2" : ""
                    }
                  >
                    {String(key).padStart(2, "0")}
                  </Td>
                  <Td
                    width="736px"
                    color="#000"
                    fontFamily="PP Telegraf"
                    fontSize="16px"
                    fontStyle="normal"
                    fontWeight="400"
                    lineHeight="125%" /* 20px */
                    borderBottom={
                      index < rulesMap.size - 1 ? "1px solid #cdddf2" : ""
                    }
                  >
                    {value}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Criteria;
