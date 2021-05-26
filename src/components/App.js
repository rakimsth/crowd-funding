import React, { useEffect } from "react";
import "./App.css";
import Web3 from "web3";

function App() {
  const loadWeb3 = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        window.alert("User Rejected the Request");
      }
    }
    // Legacy dapp Browser...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  useEffect(() => {
    loadWeb3();
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
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto"></div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
