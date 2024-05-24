import { Box, Divider, Flex, Spacer, Text } from "@chakra-ui/react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import ButtonComponent from "@scope/ui/components/buttonComponent";
import Timer from "@scope/ui/components/timer";
import { useRouter } from "next/router";
import { useEffect } from "react";

const LoginPage = () => {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard");
    }
  }, [ready, authenticated, router]);

  const { login } = useLogin({
    onComplete: (user, isNewUser, loginMethod) => {
      console.log(user, isNewUser, loginMethod);
      router.push("/dashboard");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return (
    <Box mt="100px" alignContent="center">
      <Flex direction="column" alignItems="center">
        <Spacer />
        <Text fontSize="72px" color="#24295A" fontFamily="PP Telegraf">
          CLAIM TOKENS
        </Text>
        <Text fontSize="24px" color="#24295A" fontFamily="PP Telegraf">
          Login to check your eligibility
        </Text>
        <Flex padding="24px">
          <ButtonComponent type="login" onClick={login} isDisabled={!ready} />
        </Flex>
        <Divider
          orientation="vertical"
          w="0px" // in figma - 1px
          h="128px"
          opacity="0.5"
          borderWidth="1px"
          borderColor="#000000"
          transform="rotate(180deg)"
        />
        <Timer />
      </Flex>
    </Box>
  );
};
export default LoginPage;
