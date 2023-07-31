//typescript interface
interface networkConfigItem {
    name?: string;
    ethUsdPriceFeed?: string;
}
interface networkConfigInfo {
    [key: number]: networkConfigItem;
}
export const networkConfig: networkConfigInfo = {
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
};

export const developmentChains = ["hardhat", "localhost"];

export const DECIMALS = 8;
export const INTIAL_ANSWER = 200000000000;
