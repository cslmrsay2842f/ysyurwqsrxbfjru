import {
  Box,
  Button,
  chakra,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useLogout, useLogin, usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import Criteria from "../../components/criteria";
import userIcon from "../../components/images/user.svg";

import MyShellIcon from "./MyShellIcon";

const shortenWallet = (address: string) =>
  `${address.slice(0, 5)}...${address.slice(
    address.length - 4,
    address.length
  )}`;

export const Navbar = () => {
  const router = useRouter();
  const { user } = usePrivy();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { login } = useLogin({
    onComplete: () => {
      router.push("/dashboard");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { logout } = useLogout({
    onSuccess: () => {
      router.push("/");
    },
  });

  // TODO give this a better name?
  const [buttonText, setButtonText] = useState<string>();

  const handleMouseEnter = () => {
    if (!user) return;
    setButtonText("Logout");
  };

  const handleMouseLeave = () => {
    if (!user || !buttonText) return;
    setButtonText(undefined);
  };

  const handleIconClick = () => {
    window.open("https://myshell.ai/", "_blank");
  };

  const handleCareersClick = () => {
    window.open("https://boards.greenhouse.io/myshell", "_blank");
  };

  const handleWhitePaperClick = () => {
    window.open("https://docs.myshell.ai/", "_blank");
  };

  return (
    <>
      <NavbarContainer
        w="1440px"
        h="88px"
        padding="16px 80px"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Box onClick={handleIconClick} cursor="pointer">
          <MyShellIcon />
        </Box>{" "}
        <Spacer />
        <Flex gap="16px">
          <Box
            cursor="pointer"
            fontFamily="PP Telegraf"
            onClick={handleWhitePaperClick}
          >
            Whitepaper
          </Box>
          <Box cursor="pointer" onClick={onOpen} fontFamily="PP Telegraf">
            Criteria
          </Box>
          <Box
            onClick={handleCareersClick}
            fontFamily="PP Telegraf"
            cursor="pointer"
          >
            Careers
          </Box>
        </Flex>
        <Spacer />
        {!user ? (
          ""
        ) : (
          <Button
            w="157px"
            h="56px"
            p="8px 16px"
            borderRadius="999px"
            bg="rgba(10, 10, 10, 0.64)"
            display="flex"
            alignItems="center"
            onClick={user ? logout : login}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {!buttonText ? (
              <Flex>
                <Flex mr="8px">
                  {user && (
                    <Image
                      src={userIcon}
                      alt="userIcon"
                      width="40"
                      height="40"
                    />
                  )}
                </Flex>

                <Flex flexDirection="column" alignItems="center">
                  <Text
                    fontSize="16px"
                    fontStyle="normal"
                    fontWeight="400"
                    lineHeight="125%"
                    color="var(--Gray-500, rgba(10, 10, 10, 0.64))"
                  >
                    {user ? user.id.slice(14, 20) : "Login"}
                  </Text>
                  <Flex alignItems="center">
                    <Text
                      fontSize="12px"
                      fontStyle="normal"
                      fontWeight="400"
                      lineHeight="125%"
                      color="var(--Gray-500, rgba(10, 10, 10, 0.64))"
                    >
                      {user && user?.wallet?.address
                        ? shortenWallet(user?.wallet?.address)
                        : ""}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            ) : (
              <Flex flexDirection="column" alignItems="center">
                <Text
                  fontSize="16px"
                  fontStyle="normal"
                  fontWeight="400"
                  lineHeight="125%"
                  color="var(--Gray-500, rgba(10, 10, 10, 0.64))"
                >
                  Logout
                </Text>
              </Flex>
            )}
          </Button>
        )}
      </NavbarContainer>
      <Criteria isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const NavbarContainer = chakra(Flex);
