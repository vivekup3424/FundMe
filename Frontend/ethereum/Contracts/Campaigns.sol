//SPDX-License-Identifier: MIT
pragma solidity >=0.4.16 <0.9.0;

contract CampaignFactory {
    // A campaign factory to create new campaigns
    address[] public deployedCampaigns;

    function createCampaign(uint min) public {
        Campaign newCampaign = new Campaign(min, msg.sender); //creating new instance of Campaign
        deployedCampaigns.push(address(newCampaign)); //pushing instances of new created/deployed campaigns
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint Numberofapprovals;
        mapping(address => bool) approvals;
    }
    uint public Numofapprovers;
    uint numRequests;
    mapping(uint => Request) public requests;
    address public manager;
    uint private minContribution;
    mapping(address => bool) approvers;

    constructor(uint min, address creator) {
        minContribution = min;
        manager = creator;
        Numofapprovers = 0;
    }

    modifier restriction() {
        require(msg.value > minContribution);
        _;
    }
    modifier isManager() {
        require(msg.sender == manager);
        _;
    }

    function contribute() public payable restriction {
        if (approvers[msg.sender] == false ) {
            Numofapprovers++;
        }
        approvers[msg.sender] = true;
    }

    function createRequest(
        string memory desc,
        uint val,
        address payable rec
    ) public isManager {
        Request storage r = requests[numRequests++];
        r.description = desc;
        r.value = val;
        r.recipient = rec;
        r.complete = false;
        r.Numberofapprovals = 0;
    }

    function approveRequest(uint index) public {
        Request storage req = requests[index];

        require(approvers[msg.sender]); //msg sender is in list of approvers
        require(!req.approvals[msg.sender]); //approver hasn't already voted No

        req.approvals[msg.sender] = true;
        req.Numberofapprovals++;
    }

    function finalizeRequest(uint index) public payable isManager {
        Request storage req = requests[index];
        require(!req.complete);
        require(req.Numberofapprovals > (Numofapprovers / 2));
        req.complete = true;
        req.recipient.transfer(req.value);
    }

    function SummariseCampaign()
        public
        view
        returns (uint, uint, uint, uint, address)
    {
        return (
            minContribution,
            address(this).balance,
            numRequests,
            Numofapprovers,
            manager
        );
    }

    function isContributor(address approver)external view returns (bool)
    {
        return (approvers[approver]==true);
    }

    function hasAlreadyApproved(uint index) public view returns (bool) {
        Request storage req = requests[index];
        return (req.approvals[msg.sender] == true);
    }


    function getNumRequests() public view returns (uint) {
        return numRequests;
    }
}
