import { NEXT_CLIENT_ENV, getBaseUrl } from "@scope/lib";
import {
  coinbaseWallet,
  magicLink,
  metamaskWallet,
  rainbowWallet,
  safeWallet,
  ThirdwebAuthConfig,
  walletConnect,
} from "@thirdweb-dev/react";
import { DAppMetaData } from "@thirdweb-dev/wallets";

export const useProviderConfig = () => {
  const {
    NEXT_PUBLIC_MAGIC_API_KEY,
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  } = NEXT_CLIENT_ENV();

  const url = getBaseUrl();

  const projectId = NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
  const activeChain = undefined; // Specify a chain here if you want to force the user onto a specific chain

  const dAppMetadata: DAppMetaData = {
    name: "Repo Template App",
    description: "This is our app",
    url,
  };

  const supportedWallets = [
    magicLink({ apiKey: NEXT_PUBLIC_MAGIC_API_KEY, type: "connect" }),
    metamaskWallet({ projectId }),
    walletConnect({ projectId }),
    coinbaseWallet(),
    rainbowWallet({ projectId }),
    safeWallet(),
  ];

  // TODO make better
  const authConfig: ThirdwebAuthConfig = {
    domain: "localhost:3000",
  };

  return {
    projectId,
    authConfig,
    activeChain,
    dAppMetadata,
    supportedWallets,
    clientId: NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  };
};
