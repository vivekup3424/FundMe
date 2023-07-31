# Decentralized Funding Application

This is a sample decentralized funding application built on the Ethereum blockchain using Solidity smart contracts. The application allows users to contribute funds to a crowdfunding campaign and withdraw the funds when needed. It utilizes Chainlink Price Feeds to determine the current conversion rate of ETH to USD.

## Prerequisites

-   [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com/) installed
-   [Hardhat](https://hardhat.org/) development environment

## Smart Contracts

The application consists of the following main smart contracts:

-   `FundMe.sol`: The main contract for crowd funding. Users can fund the campaign and withdraw funds, while the contract owner can perform administrative functions.

-   `PriceConverter.sol`: A library contract that provides utility functions to convert ETH value to USD using Chainlink Price Feeds.

## Dependencies

The application relies on the following external dependencies:

-   [`@chainlink/contracts`](https://github.com/smartcontractkit/chainlink): Chainlink smart contract interfaces for interacting with price feeds.
-   [`hardhat/console`](https://hardhat.org/guides/debugging-solidity-tests.html#console-log): Hardhat console library for debugging purposes.

## Getting Started

1. Clone the repository:

git clone https://github.com/vivekup3424/decentralized-funding-app.git
cd decentralized-funding-app

markdown

2. Install the dependencies:

npm install

arduino

3. Deploy the smart contracts using Hardhat:

npx hardhat run scripts/deploy.js --network <network_name>

markdown

Replace `<network_name>` with the target network, such as `rinkeby`, `ropsten`, or `mainnet`.

4. Interact with the smart contract using the provided functions in the `FundMe` contract. You can fund the campaign, withdraw funds, get information about funders, and more.

## Usage

The application provides the following main functions:

-   `fund()`: Allows users to contribute funds to the crowdfunding campaign. The minimum contribution is 0.5 ETH.

-   `withdraw()`: Allows the contract owner to withdraw all the contributed funds to their address. This function can be called when the campaign is completed.

-   `getAddressToAmountFunded(address funder)`: Returns the amount of funds contributed by a specific funder.

-   `getFunders(uint256 index)`: Returns the address of the funder at the specified index.

-   `getOwner()`: Returns the address of the contract owner.

## How It Works

The `FundMe` contract uses the Chainlink Price Feeds to convert the value of contributions from ETH to USD. It ensures that the minimum contribution amount is met before accepting the funds.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
