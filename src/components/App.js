/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar';
import Main from './Main';
import Loader from '../global/Loader';
// Blockchain stuff
import CrowdFunding from '../abis/Crowdfunding.json';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [projectCount, setProjectCount] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [crowdFunding, setCrowdFunding] = useState(null);

  const loadWeb3 = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        const { web3 } = window;
        // Load Accounts
        const accounts = await web3.eth.getAccounts();
        // Set current Account to State
        setCurrentAccount(accounts[0]);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'User Rejected the Request!',
        });
      }
    }
    // Legacy dapp Browser...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Non-Ethereum browser detected. You should consider trying MetaMask!',
      });
    }
  };

  const getDatafromWeb3 = async () => {
    const { web3 } = window;
    // Load Accounts
    const accounts = await web3.eth.getAccounts();
    // Get networkId
    const networkId = await web3.eth.net.getId();
    const networkData = CrowdFunding.networks[networkId];
    // Get abi Data from ABI json file
    try {
      const { abi } = CrowdFunding;
      const { address } = networkData;
      const marketplace = new web3.eth.Contract(abi, address);
      setCrowdFunding({ marketplace });
      setLoading(false);
    } catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Contract not deployed to detected Network!',
      });
    }
    // Set current Account to State
    setCurrentAccount(accounts[0]);
  };

  const createProject = async (name, desc, target, closingDate) => {
    setLoading(true);
    crowdFunding.marketplace.methods
      .createProject(name, desc, target, closingDate)
      .send({ from: currentAccount })
      .once('receipt', (receipt) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadWeb3();
    getDatafromWeb3();
  }, []);

  return (
    <div>
      <Navbar account={currentAccount || ''} />
      <div className="container mt-5">
        <div className="row">
          <main className="col-lg-12">
            <h1 className="text-center">
              Crowd Funding Application using Solidity, Web3.js and Ethereum
            </h1>
            {loading ? <Loader /> : <Main createProject={createProject} />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
