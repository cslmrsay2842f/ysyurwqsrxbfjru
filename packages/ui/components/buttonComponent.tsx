import { Button, Flex, Spinner } from "@chakra-ui/react";

const ButtonComponent = ({
  type,
  onClick,
  isDisabled,
  enable,
  value,
  buttonName,
  loading,
  error,
}: {
  type?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  enable?: boolean;
  value?: string;
  buttonName?: string;
  loading?: boolean;
  error?: string;
}) => {
  let buttonContent;

  if (type === "claim" || type === "Done") {
    if (enable) {
      buttonContent = (
        <Button
          w="136px"
          h="46px"
          // p="15px 48px"
          color="white"
          borderRadius="99px"
          bg="linear-gradient(90deg, #6966F5, #6D63F5, #568EFF)"
          onClick={onClick}
          _hover={{
            bg: "linear-gradient(90deg, #6966F5, #6D63F5, #568EFF)",
          }}
        >
          {loading ? <Spinner /> : buttonName}
        </Button>
      );
    } else if (error || !enable) {
      buttonContent = (
        <Button
          w="136px"
          h="46px"
          p="15px 48px"
          borderRadius="99px"
          bg="gray"
          isDisabled
        >
          {buttonName}
        </Button>
      );
    }
  } else if (type === "login") {
    buttonContent = (
      <Button
        w="133px"
        h="46px"
        p="15px 48px"
        borderRadius="99px 99px 99px 99px"
        bg="transparent"
        border="2px solid #6966F5"
        color="radial-gradient(100% 900% at 0% 0%, #6966F5, #6D63F5, #568EFF)"
        onClick={onClick}
        disabled={isDisabled}
        _hover={{
          bg: "linear-gradient(to-r, #6966F5, #6D63F5, #568EFF)",
          color: "white",
          backgroundImage: "linear-gradient(to-r, #568EFF, #6D63F5, #6966F5)",
          borderColor: "transparent",
        }}
      >
        Login
      </Button>
    );
  } else if (type === "navbar") {
    buttonContent = (
      <Button
        w="64px"
        h="16px"
        lineHeight="16.1"
        fontWeight="400"
        color="black"
      >
        {value}
      </Button>
    );
  } else if (type === "network") {
    buttonContent = (
      <Button
        w="128px"
        h="32px"
        bg="white" // Set the text color to white
        color="#0A0A0A"
        borderRadius="999px 999px 999px 999px"
      >
        {value}
      </Button>
    );
  }

  return (
    <Flex direction="column" alignItems="center">
      {buttonContent}
    </Flex>
  );
};

export default ButtonComponent;
