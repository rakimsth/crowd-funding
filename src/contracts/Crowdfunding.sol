// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

contract Crowdfunding {
    string public name;
    uint public projectCount = 0;
    mapping(uint => Project) projects;

    struct Project {
        uint id;
        string name;
        address owner;
        uint endTime;
        bool exists;
        uint balance;
    }

    constructor() {
        name = "Marketplace for crowd funding";
    }

    function createProject() public {
        // Make sure parameters are correct
        //Increment Project Count
        projectCount ++;
        // Create the project
        // trigger an event
    }
}
