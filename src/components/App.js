/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Container, Jumbotron } from 'react-bootstrap';
import './App.css';
import Web3 from 'web3';
import Navbar from './Navbar';
import Main from './Main';
import Loader from '../global/Loader';
import bgimage from '../assets/crowfunding.jpg';
// Blockchain stuff
import CrowdFunding from '../abis/Crowdfunding.json';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [crowdFunding, setCrowdFunding] = useState({});

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
    if (window.web3) {
      const { web3 } = window;
      // Load Accounts
      const accounts = await web3.eth.getAccounts();
      // Set current Account to State
      setCurrentAccount(accounts[0]);
      // Get networkId
      const networkId = await web3.eth.net.getId();
      const networkData = CrowdFunding.networks[networkId];
      // Get abi Data from ABI json file
      try {
        const { abi } = CrowdFunding;
        const { address } = networkData;
        const marketplace = new web3.eth.Contract(abi, address);
        setCrowdFunding({ ...marketplace });
        const projectCounter = await marketplace.methods.projectCount().call();
        const projectLists = [];
        for (let i = 1; i <= projectCounter; i++) {
          const project = await marketplace.methods.projects(i).call();
          projectLists.push(project);
        }
        setProjects(projectLists);
        setLoading(false);
      } catch (e) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Contract not deployed to detected Network!',
        });
      }
    }
  };

  const createProject = async (name, desc, target, closingDate) => {
    setLoading(true);
    try {
      crowdFunding.methods
        .createProject(name, desc, target, closingDate)
        .send({ from: currentAccount })
        .once('receipt', async (receipt) => {
          await getDatafromWeb3();
          setLoading(false);
        })
        .catch((e) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: e.message,
          });
          setLoading(false);
        });
    } catch (e) {
      setLoading(false);
    }
  };

  const fundProject = async (id, amount) => {
    setLoading(true);
    try {
      const WeiAmt = window.web3.utils.toWei(amount, 'Ether');
      crowdFunding.methods
        .fundProject(id)
        .send({ from: currentAccount, value: WeiAmt })
        .once('receipt', async (receipt) => {
          await getDatafromWeb3();
          setLoading(false);
        })
        .catch((e) => {
          let err;
          if (e.code === -32603) err = "Owner can't fund the project created by themselves";
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err || e.message,
          });
          setLoading(false);
        });
    } catch (e) {
      setLoading(false);
    }
  };

  const closeProject = async (id) => {
    setLoading(true);
    try {
      crowdFunding.methods
        .closeProject(id)
        .send({ from: currentAccount })
        .once('receipt', async (receipt) => {
          await getDatafromWeb3();
          setLoading(false);
        })
        .catch((e) => {
          let err;
          if (e.code === -32603) err = 'Only Project Owner can close this project.';
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err || e.message,
          });
          setLoading(false);
        });
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(async () => {
    await loadWeb3();
    await getDatafromWeb3();
  }, []);

  return (
    <div>
      <Navbar account={currentAccount || ''} />
      <div className="container mt-5">
        <div className="row">
          <main className="col-lg-12">
            <div
              className="p-md-5 mb-4 text-white rounded"
              style={{
                backgroundImage: `url(${bgimage})`,
                height: '400px',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            />
            {/* <h1 className="text-center">
              Crowd Funding Application using Solidity, Web3.js and Ethereum
            </h1> */}
            {loading ? (
              <Loader />
            ) : (
              <Main
                createProject={createProject}
                fundProject={fundProject}
                projects={projects}
                closeProject={closeProject}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
