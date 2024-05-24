/* eslint-disable global-require -- super handy, itll be okay */
/* eslint-disable import/no-dynamic-require -- super handy, itll be okay */
const network =
  process.env.NEXT_PUBLIC_NETWORK === "production" ? "mainnet" : "sepolia";

export const AirdropDeployment = require(`@scope/contracts/deployments/${network}/Airdrop.json`);
export const MyShellTokenContract = require(`@scope/contracts/deployments/${network}/MyShell.json`);

export const isTest = process.env.NEXT_PUBLIC_VERCEL_ENV !== "production";

export const bucketURL = () =>
  process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";
