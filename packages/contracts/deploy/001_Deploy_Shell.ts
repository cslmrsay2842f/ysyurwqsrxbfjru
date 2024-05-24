import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre;

  const { deployer } = await getNamedAccounts();

  await deploy("MyShell", {
    contract: "MyShell",
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });
};

export default func;
func.tags = ["testbed", "_MyShell"];
