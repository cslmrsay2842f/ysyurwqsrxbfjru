import { Flex } from "@chakra-ui/react";
import { NextPage } from "next";

import LoginPage from "./login";

const HomePage: NextPage = () => (
  <Flex
    p="20px"
    justifyContent="center"
    alignItems="center"
    h="100vh"
    flexDirection="column"
  >
    <LoginPage />
  </Flex>
);

export default HomePage;
