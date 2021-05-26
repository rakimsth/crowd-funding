/* eslint-disable jest/valid-describe */
/* eslint-disable no-undef */
const Crowdfunding = artifacts.require("Crowdfunding");

contract("Crowdfunding", (accounts) => {
  let crowdfunding;

  before(async () => {
    crowdfunding = await Crowdfunding.deployed();
  });

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

  describe("projects", async () => {
    let result, projectCount;
    before(async () => {
      result = await crowdfunding.createProject();
      projectCount = await crowdfunding.projectCount();
    });
    it("creates products", async ()=>{
      // SUCCESS
      assert.equal(projectCount, 1); 
    });
  });


});
