const VendingMachine = artifacts.require("VendingMachine");

//contract body
contract("Vending Machine", (accounts) => {
  //get the instance of the current before test in the virtual memory so that we always have a contract before unit tests.
  before(async () => {
    instance = await VendingMachine.deployed();
  });

  it("Initial balance of the vending machine should be equal to 100", async () => {
    let balance = await instance.getVendingMachineBalance();
    assert.equal(balance, 100, "The initial balance should be 100");
  });

  it("Vending machine balance should be updated or restocked", async () => {
    await instance.restock(100);
    let balance = await instance.getVendingMachineBalance();
    assert.equal(balance, 200, "The updated balance should be 200");
  });

  it("Vending machine should allow purchasing and calculations", async () => {
    await instance.purchase(1, {
      from: accounts[0],
      value: web3.utils.toWei("3", "ether"),
    });
    let balance = await instance.getVendingMachineBalance();
    assert.equal(balance, 199, "The updated balance should be 199");
  });
});
