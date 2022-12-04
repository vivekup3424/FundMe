import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { ETHERSCAN_API_KEY } from "../hardhat.config";
import verify from "../utils/verify";
const deployFundMe: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    // @ts-ignore
    const { deployments, getNamedAccounts, network, getChainId } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId!; //! is not-null assertion operator

    //const ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
    let ethUsdPriceFeedAddress: string;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator"); //deploying the mock contract
        ethUsdPriceFeedAddress = ethUsdAggregator.address; //address at which mock data feed is deployed
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed!; //! is not-null assertion operator
    }
    //well what happens when we want to change chains
    //when going for localhost or hardhat network we want to use a mock
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], //put price feed address
        log: true,
        waitConfirmations: 1,
    });
    console.log("--------------------------");
    if (!developmentChains.includes(network.name) && ETHERSCAN_API_KEY) {
        //verify the deployment of contract programmatically
        await verify(fundMe.address, [ethUsdPriceFeedAddress]); //address of the deployed contract
    }
};
export default deployFundMe;
deployFundMe.tags = ["all", "fundme"];
