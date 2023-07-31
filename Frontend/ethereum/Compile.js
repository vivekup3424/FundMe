const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");//deletes currently existing(if) build folder
fs.removeSync(buildPath);

const cPath = path.resolve(__dirname, "Contracts", "Campaigns.sol");
const source = fs.readFileSync(cPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Campaigns.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

//Compiling the contract once and then saving it in build folder 
for (let element in output.contracts['Campaigns.sol'])//doing this coz 2 contracts are defined within the contract
{
    fs.outputJSONSync(
        path.resolve(buildPath,element+'.json'),//naming the file
        output.contracts['Campaigns.sol'][element]//content in file
    );
}

fs.ensureDirSync(buildPath);//creates build folder
