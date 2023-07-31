const assert=require('assert');
const ganache=require('ganache-cli');
const Web3=require('web3');
const web3=new Web3(ganache.provider());

const compiledCampFactory= require('../build/CampaignFactory.json');
const compiledCamp= require('../build/Campaign.json');

let accounts,factory,campaignaddress,campaign;

beforeEach(async()=>{
    accounts=await web3.eth.getAccounts();
    
    factory=await new web3.eth.Contract(JSON.parse(compiledCampFactory.interface))
    .deploy({data:compiledCampFactory.bytecode})
    .send({from: accounts[0], gas:'1000000'});

    //using factory to create instance of campaign(i.e. deploy a campaign using factory class) so as to not repeatedly do so in it()
    await factory.methods.createCampaign('100').send({
        from:accounts[0],
        gas:'1000000'
    });
    [campaignaddress]=await factory.methods.getDeployedCampaigns().call();
    
    campaign= await new web3.eth.Contract(
        JSON.parse(compiledCamp.interface),campaignaddress
    );

})