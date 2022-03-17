import React, { useEffect, useState } from "react";
// import detectEthereumProvider from "@metamask/detect-provider";
import VendingMachine from "./abis/VendingMachine.json";
import Web3 from "web3";
import "./App.css";

import { Audio, TailSpin } from "react-loader-spinner";

const HDWalletProvider = require("@truffle/hdwallet-provider");

const ownerAddress = "0x889831A155Bf9b42C589765df20e1B6F02cb3C28";

const App = () => {
  const [accounts, setAccounts] = useState("");
  const [contract, setContract] = useState(null);
  const [bal, setBalance] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stock, setStock] = useState(0);

  //load web3
  const loadWeb3 = async () => {
    // const provider = await detectEthereumProvider();
    const provider = new HDWalletProvider(
      "anxiety raw test seat veteran bring grant window then minimum candy wife",
      "https://rinkeby.infura.io/v3/fe7f16df813544b4b1107adc991458d0"
    );
    if (provider) {
      console.log("wallet is connected!");
      Window.web3 = new Web3(provider);
    } else {
      console.log("wallet is not connected!");
    }
  };

  //load blockchain data
  const loadBlockchainData = async () => {
    const web3 = Window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccounts(accounts[0]);
    console.log("ACCOUNTS ", accounts);

    const netId = await web3.eth.net.getId();
    const netData = VendingMachine.networks[netId];

    if (netData) {
      const abi = VendingMachine.abi;
      const address = netData.address;
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract);
      console.log("CONTRACT ", await contract.methods);

      // get balance of the vending machine
      const bal = await contract.methods.getVendingMachineBalance.call();
      setBalance(bal.toString());
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  //restock the donut supply
  const restockDonuts = async () => {
    const number = parseInt(stock);
    console.log("NUMBER PASSED ", stock);
    const restocked = await contract.methods.restock(stock).call();
    console.log("RESTOCKED ", restocked);
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  if (isLoading) {
    return (
      <div className="loader">
        <TailSpin height="100" width="100" color="blue" ariaLabel="loading" />
      </div>
    );
  }

  return (
    <div style={{ padding: 100 }}>
      <h1>Donut Machine Balance: {bal} </h1>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          className="input"
          placeholder="Enter Restock Amount"
          onChange={(e) => setStock(e.target.value)}
        />
        <button
          className="button"
          style={{ fontSize: 16 }}
          onClick={restockDonuts}
        >
          Restock Donuts
        </button>
      </div>
    </div>
  );
};

export default App;
