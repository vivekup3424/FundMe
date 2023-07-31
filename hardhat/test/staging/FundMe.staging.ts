import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { FundMe } from "../../typechain-types";
import { developmentChains } from "../../helper-hardhat-config";
import { assert } from "chai";

//does staging only on testnet or mainnet
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", () => {
          let fundMe: FundMe;
          const sendValue = ethers.utils.parseEther("0.1");
          let deployer: string;

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              fundMe = await ethers.getContract("FundMe", deployer);
          });

          it("allows people to fund and deployer to withdraw from contract", async () => {
              await fundMe.fund({ value: sendValue });
              await fundMe.withdraw;
              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );
              assert.equal(endingBalance.toString(), "0");
          });
      });
