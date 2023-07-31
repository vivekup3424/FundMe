import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";
const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0xB0C4EC23760547b00ac65156FbBE8bc9658CfD21"
);

export default instance;
