// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;
/* 
TODO
    - Create a Project : createProject
    - Fetch all Projects : 
    - Read a Project : getProjectById
    - Fund an existing Project
    - Close the Project manually or if endDate expires

*/
contract Crowdfunding {
    address contractOwner;
    string public name;
    uint public projectCount = 0;
    mapping(uint => Project) projects;

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

    constructor() {
        name = "Marketplace for crowd funding";
        contractOwner = msg.sender;
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

}
