//The truffle wallet will act as our provider which will simultaneously
/* help us to connect to a network hosted through infura and also\
help in easily unlocking an account to use 


The provider instructs web3 which network to connect to
*/
require('dotenv').config();
const wallet=require('truffle-hdwallet-provider');
const Web3=require('web3');
const compiledFactory= require('./build/CampaignFactory.json');
const provider=new wallet(
    process.env.PRIVATE_KEY,
    process.env.RPC_URL
)
/* The account mnemonic helps to derive both public and private key of account */
const web3=new Web3(provider);

const deploy= async()=>{
    /* Step1--Get a list of all accounts that have been unlocked using
    our wallet provider */
    const accounts= await web3.eth.getAccounts();
    console.log("Attempting to deploy from account",accounts[0]);


    const result=await new web3.eth.Contract((compiledFactory['abi']))
    .deploy({data:compiledFactory['evm']['bytecode'].object})
    .send({gas:5000000,from:accounts[0]});

    console.log('Contract deployed to: ',result.options.address);
};
deploy();