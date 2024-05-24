import "@total-typescript/ts-reset";
import { ChakraProvider } from "@chakra-ui/react";
import { Global } from "@emotion/react";
import { PrivyProvider } from "@privy-io/react-auth";
import { Navbar, theme, useProviderConfig } from "@scope/ui";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Analytics } from "@vercel/analytics/react";
import { AppProps } from "next/app";
import Head from "next/head";
import Image from "next/image";
import { mainnet, sepolia } from "viem/chains";

import background from "../public/background.png";

import { isTest } from "@/constants";
import { trpc } from "@/utils/trpc";

const App = ({ Component, pageProps }: AppProps): JSX.Element => (
  <ChakraProvider theme={theme}>
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        defaultChain: isTest ? sepolia : mainnet,
        supportedChains: [isTest ? sepolia : mainnet],
      }}
    >
      {/* @ts-ignore - TODO fogure out why this doesnt work */}
      <ThirdwebProvider {...useProviderConfig()}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Analytics />
        <Global
          styles={{
            body: {
              overflow: "hidden",
            },
          }}
        />
        <Image
          alt="bg"
          src={background}
          layout="fill"
          objectFit="cover"
          style={{ zIndex: -1 }}
        />
        <Navbar />
        <Component {...pageProps} />
      </ThirdwebProvider>
    </PrivyProvider>
  </ChakraProvider>
);

export default trpc.withTRPC(App);
