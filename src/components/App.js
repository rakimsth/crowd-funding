/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './App.css';
import Web3 from 'web3';

function App() {
  const [currentAccount, setCurrentAccount] = useState('');

  const loadWeb3 = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        window.alert('User Rejected the Request');
      }
    }
    // Legacy dapp Browser...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  const getDatafromWeb3 = async () => {
    const { web3 } = window;
    // Load Accounts
    const accounts = await web3.eth.getAccounts();
    // Set current Account to State
    setCurrentAccount(accounts[0]);
  };

  useEffect(() => {
    loadWeb3();
    getDatafromWeb3();
  }, []);

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-1 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://rumsan.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rumsan Academy
        </a>
        {currentAccount ? (
          <Button variant="light">{currentAccount}</Button>
        ) : (
          <Button variant="light">N/A</Button>
        )}
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto" />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
