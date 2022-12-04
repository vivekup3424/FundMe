import { FundMe } from "../typechain-types";

const { getNamedAccounts, ethers, network } = require("hardhat");

//script that funds our contract
async function main() {
    const deployer: string = await getNamedAccounts().deployer;
    const fundMe: FundMe = await ethers.getContract("FundMe", deployer);
    const sendValue: number = ethers.utils.parseEther("0.1");
    console.log("Funding Contract ...");
    const transactionResponse = await fundMe.fund({ value: sendValue });
    await transactionResponse.wait(1);
    console.log("Funded");
}
main()
    .then(() => process.exit(0))
    .catch((error: any) => {
        console.log(error);
        process.exit(1);
    });
