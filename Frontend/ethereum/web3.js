import Web3 from "web3";
let web3;
if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined')
{
    //when inside browser and connected to metamask
    web3 = new Web3(window.ethereum);
}
else
{
    //When on server side .............OR......... when metamask is not running
    const provider = new Web3.providers.HttpProvider('https://goerli.infura.io/v3/a86952746ee644dcada0f0e6134b0a84')
    web3=new Web3(provider);
}

module.exports =web3;