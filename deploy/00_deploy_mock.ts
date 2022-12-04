import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
    developmentChains,
    DECIMALS,
    INTIAL_ANSWER,
} from "../helper-hardhat-config";
module.exports = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId!;
    //if we are on a local development network, we need to deploy mocks

    if (developmentChains.includes(network.name)) {
        log("Local Network Detected! Deploying mocks...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INTIAL_ANSWER],
        });
        log("Mock Deployed.");
        log("-------------------------------------");
    }
};

module.exports.tags = ["all", "mocks"];
