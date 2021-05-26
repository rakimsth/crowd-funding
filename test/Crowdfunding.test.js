/* eslint-disable jest/valid-describe */
/* eslint-disable no-undef */
const Crowdfunding = artifacts.require("Crowdfunding");

// contract("Crowdfunding", (accounts) => { //old style
contract("Crowdfunding", ([deployer, secondAcc, thirdAcc]) => { // revised style
  let crowdfunding;

  before(async () => {
    crowdfunding = await Crowdfunding.deployed();
  });
  // Test Deployment
  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await crowdfunding.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async ()=>{
      const name =  await crowdfunding.name();
      assert.equal(name, "Marketplace for crowd funding");
    });
  });
  // Test Project Creation
  describe("projects", async () => {
    let result, projectCount;
    before(async () => {
      result = await crowdfunding.createProject("Test Name", "Test Desc", "1622420104", web3.utils.toWei("1", "Ether"), {from : deployer} );
      projectCount = await crowdfunding.projectCount();
    });
    it("creates products", async ()=>{
      // SUCCESS
      assert.equal(projectCount, 1);
      const event = result.logs[0].args; // pull from result logs
      assert.equal(event.id.toNumber(), projectCount.toNumber(), 'id is correct');
      assert.equal(event.name, 'Test Name', "Name is correct");
      assert.equal(event.desc, 'Test Desc', "Description is correct");
      assert.equal(event.target, web3.utils.toWei("1", "Ether"), "Target is correct");
      assert.equal(event.endDate, '1622420104', "Project Close Date is correct");
      assert.equal(event.exists, true, "Project Status is true");
      assert.equal(event.balance, 0, "Project Balance is set to 0");
      // assert.equal(event.owner, accounts[0], 'Owner is correct'); // old style
      assert.equal(event.owner, deployer, 'Owner is correct'); // revised style
      
      // Failure


    });
  });


});
