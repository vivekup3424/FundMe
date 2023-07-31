import web3 from './web3';
import Campaign from './build/Campaign.json';
//Exporting an instance of a particular campaign 
export default (address)=>{
    return new web3.eth.Contract(Campaign.abi,address);
} 