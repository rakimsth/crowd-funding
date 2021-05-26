// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;
/* 
TODO
    - Create a Project : createProject
    - Fetch all Projects : projects
    - Read a Project : getProjectById
    - Fund an existing Project : fundProject
    - Close the Project manually by owner or if endDate expires : closeProject
    - Get total Contract Balance : balanceOfProjects
    - Dispatch the ethers to project Owner : dispatchFunds
*/
contract Crowdfunding {
    string public name;
    uint public projectCount = 0;
    mapping(uint => Project) public projects;
    mapping(uint => mapping(address => uint)) contributors;

    struct Project {
        uint id;
        string name;
        string desc;
        address owner;
        uint256 endDate;
        bool exists;
        uint balance;
        uint target;
    }

    event ProjectCreated(
        uint id,
        string name,
        string desc,
        address owner,
        uint256 endDate,
        bool exists,
        uint balance,
        uint target
    );

    event ProjectFunded(
        uint id,
        string name,
        string desc,
        address owner,
        uint256 endDate,
        bool exists,
        uint balance,
        uint target
    );

    event ProjectEnded(uint id, string name, uint balance);

    constructor() {
        name = "Marketplace for crowd funding";
    }

    function createProject(string memory _name, string memory _desc, uint256 _endDate, uint _target) public {
        // Make sure parameters are correct and supplied
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid target
        require(_target > 0);
        // Require a valid endDate
        require(_endDate > 0);
        //Increment Project Count
        projectCount ++;
        // Create the project
        projects[projectCount] = Project(projectCount, _name, _desc, msg.sender, _endDate, true, 0, _target);
        // trigger an event
        emit ProjectCreated(projectCount, _name, _desc, msg.sender, _endDate, true, 0, _target);
    }  

    function getProjectById(uint _id) public view returns(string memory _name, string memory _desc, uint _target, uint _endDate, address _owner, uint _balance) {
        //TODO Check if project Exists
        return (projects[_id].name, projects[_id].desc, projects[_id].target, projects[_id].endDate, projects[_id].owner, projects[_id].balance);
    }

    function fundProject(uint _id) public payable{
        // Fetch the Project
        Project memory _project = projects[_id];
        //Fetch the Project Owner
        address _owner = _project.owner;
        //Check if the Project end Date is greater than now
        require(block.timestamp < _project.endDate, "Project is closed.");
        // Check if the owner is trying to fund and reject it
        require(_owner != msg.sender, "Owner can't fund the project created by themselves.");
        // Make Sure the Project is active
        require(_project.exists == true, "Project doesn't exists..");
        // Fund it
        _project.balance += msg.value;
        // Update the Project
        projects[_id] = _project;
        //hold the money to the contract until it expires or closes;

        // contributors can again send the money
        contributors[_id][msg.sender] += msg.value;
        // Trigger the event
        emit ProjectFunded(projectCount, _project.name, _project.desc, msg.sender, _project.endDate, true, _project.balance, _project.target);
    }

    function closeProject(uint _id) public {
        // Fetch the Project
        Project memory _project = projects[_id];
        //Fetch the Project Owner
        address _owner = _project.owner;
        // Check if the owner is trying to close the project
        require(_owner == msg.sender, "Only Owner can close the project.");
        // Check if the project is open or not
        require(_project.exists == true, "Project is in open state.");
        // Check endDate
        if(block.timestamp > _project.endDate){
            _project.exists = false;
            projects[_id] = _project;
            this.dispatchFunds(_project.id);
            emit ProjectEnded(_project.id, _project.name, _project.balance);
        }
        require(block.timestamp < _project.endDate, "Project is still active.");
        // Close the project
        _project.exists = false;
        projects[_id] = _project;
        // Trigger the Event
        emit ProjectEnded(_project.id, _project.name, _project.balance);
    }

    function balanceOfProjects() public view returns(uint){
        return address(this).balance;
    }

    function dispatchFunds(uint _id) public payable {
        Project memory _project = projects[_id];
        payable(_project.owner).transfer(_project.balance);
        projects[_id] = _project;
    }
}
