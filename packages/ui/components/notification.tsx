import { Box, Flex } from "@chakra-ui/react";

import ButtonComponent from "./buttonComponent";

const Notification = ({ message }: { message: string }) => {
  const backgroundColor = message.includes("canceled") ? "#B81E31" : "#FFCE0B";
  const textColor = message.includes("canceled") ? "#FFFFFF" : "#000000";

  return (
    <Flex direction="column">
      <Box
        display="inline-flex"
        padding="8px 16px"
        justifyContent="center"
        alignItems="center"
        gap="8px"
        mb="20px"
        borderRadius="99px"
        color={textColor}
        background={backgroundColor}
      >
        {message}
        <ButtonComponent type="network" value="Switch Network" />
      </Box>
    </Flex>
  );
};

export default Notification;
