import { assert, expect } from "chai";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { developmentChains } from "../../helper-hardhat-config";

//does unit test only on development chains
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Fund Me", () => {
          let fundMe: FundMe;
          let mockV3Aggregator: MockV3Aggregator;
          const sendValue = ethers.utils.parseEther("0.1"); //1ETH
          let deployer: string;
          //let fundMe;
          //let mockV3Aggregator;
          //const sendValue = ethers.utils.parseEther("1"); //1ETH
          //let deployer;
          beforeEach(async () => {
              //deploy fundme contract using hardhat deploy
              deployer = (await getNamedAccounts()).deployer;
              await deployments.fixture(["all"]);
              fundMe = await ethers.getContract("FundMe", deployer);
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              );
          });
          describe("constructor", () => {
              it("sets the aggregator addresses correctly", async () => {
                  const response = await fundMe.getPriceFeed();
                  assert.equal(response, mockV3Aggregator.address); //when deploying locally
              });
          });

          describe("fund", () => {
              it("Fail if you don't send enough eth", async () => {
                  await expect(fundMe.fund({ value: 0 })).to.be.revertedWith(
                      //hardhat-toolbox
                      "You need to spend more ETH!"
                  );
              });
              it("update the amount funded data structure", async () => {
                  await fundMe.fund({ value: sendValue });
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  );
                  assert.equal(response.toString(), sendValue.toString());
              });
              it("Adds funder to array of funders", async () => {
                  await fundMe.fund({ value: sendValue });
                  const funder = await fundMe.getFunders(0);
                  assert.equal(funder, deployer);
              });
          });

          describe("withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue });
              });
              it("Withdraw ETH from a single founder", async () => {
                  //Arrange
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  //Act
                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);

                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundeMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  //Assert
                  assert.equal(endingFundeMeBalance.toString(), "0");
                  assert.equal(
                      endingDeployerBalance.add(gasCost).toString(),
                      startingDeployerBalance
                          .add(startingFundMeBalance)
                          .toString()
                  );
              });

              it("allows us to withdraw ETH from multiple funders", async () => {
                  //Arrange
                  const accounts = await ethers.getSigners();
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          //@ts-ignore
                          accounts[i]
                      );
                      await fundMeConnectedContract.fund({ value: sendValue });
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);

                  //Act
                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  //consoling out
                  console.log(`Gas Used: ${gasUsed}`);
                  console.log(`Effective Gas Price: ${effectiveGasPrice}`);
                  console.log(`Gas cost: ${gasCost}`);

                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  const endingFundeMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );

                  //Assert
                  //assert.equal(endingFundeMeBalance.toString(), "0");
                  assert.equal(
                      endingDeployerBalance.add(gasCost).toString(),
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString()
                  );

                  //Make sure that the funders array are reset correctly
                  await expect(fundMe.getFunders(0)).to.be.reverted;
                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await (
                              await fundMe.getAddressToAmountFunded(
                                  //@ts-ignore
                                  accounts[i].address
                              )
                          ).toString(),
                          "0"
                      );
                  }
              });

              /*This is an test for cheaper withdraw function */
              it("cheaper Withdraw testing...", async () => {
                  //Arrange
                  const accounts = await ethers.getSigners();
                  for (let i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          //@ts-ignore
                          accounts[i]
                      );
                      await fundMeConnectedContract.fund({ value: sendValue });
                  }
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);

                  //Act
                  const transactionResponse = await fundMe.cheaperWithdraw();
                  const transactionReceipt = await transactionResponse.wait(1);
                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  //consoling out
                  console.log(`Gas Used: ${gasUsed}`);
                  console.log(`Effective Gas Price: ${effectiveGasPrice}`);
                  console.log(`Gas cost: ${gasCost}`);

                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer);
                  const endingFundeMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );

                  //Assert
                  //assert.equal(endingFundeMeBalance.toString(), "0");
                  assert.equal(
                      endingDeployerBalance.add(gasCost).toString(),
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString()
                  );

                  //Make sure that the funders array are reset correctly
                  await expect(fundMe.getFunders(0)).to.be.reverted;
                  for (let i = 1; i < 6; i++) {
                      assert.equal(
                          await (
                              await fundMe.getAddressToAmountFunded(
                                  //@ts-ignore
                                  accounts[i].address
                              )
                          ).toString(),
                          "0"
                      );
                  }
              });
              it("Only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners();
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[2]
                  );
                  await expect(
                      fundMeConnectedContract.withdraw()
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner");
              });
          });
      });
