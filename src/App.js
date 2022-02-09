import * as React from "react";
import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";



const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaves, setTotalWaves] = useState(0);
  const [waverMsg, setWaverMsg] = useState(""); 
  const [allWaves, setAllWaves] = useState([]);



  const contractAddress = "0x11c7ec60bC4c8B2f3489919bA93010c153708F18";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)

      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const connectWallet = async () => {
    try {

      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  };

  const getTotalWaves = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				await wavePortalContract
					.getTotalWaves()
					.then((waves) =>
						setTotalWaves(ethers.BigNumber.from(waves).toString())
					);
			}
		} catch (e) {
			console.log(e);
		}
	}; 

  const getAllWaves = async () => {
		try {
			const { ethereum } = window;

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				const wavePortalContract = new ethers.Contract(
					contractAddress,
					contractABI,
					signer
				);

				let wavesCleaned = [];

				const waves = await wavePortalContract.getAllWaves();

				waves.forEach((wave) =>
					wavesCleaned.push({
						address: wave.waver,
						message: wave.message,
						timestamp: new Date(wave.timestamp * 1000),
					})
				);

				setAllWaves(wavesCleaned);
			} else console.log("ethereum object doesn't exist!");
		} catch (e) {
			console.log(e);
		}
	};

  
  
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());


        /*
       * Execute the actual wave from your smart contract
       */
        const waveTxn = await wavePortalContract.wave(waverMsg,{ gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setTotalWaves(count.toNumber());
        getAllWaves()
        setWaverMsg("");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
 
  const handleChange = (event) => {
    setWaverMsg(event.target.value);
  }

  useEffect(() => {
		checkIfWalletIsConnected();
		getTotalWaves();
		getAllWaves();
	}, [totalWaves, currentAccount]);

  return (
    <div className="mainContainer">

      <div className="dataContainer">

        <div className="header">
          Welcome to my <span role="img" aria-label="Snowman">👋</span> Page!
        </div>


        <div className="bio">
          I am Efrain and I'm gonna create amazing projects on Web3 !
        </div>
        <div className="earn">
          There is a 50% chance you'll get 0.001 ETH airdropped when you wave, 💸!
        </div>

        <div id="message-form">

          <form >
            <fieldset>
              <header>
                <h3>Leave a message in the below box!</h3>
              </header>
              <input
                type="text"
                className="formInput"
                placeholder="Write your amazing wave here and click wave at me..."
                value={waverMsg}
                onChange={handleChange}
              />
            </fieldset>
          </form>

        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="wallet" onClick={connectWallet}>
            Connect Wallet
          </button>


        )}




        <div className="totalwaves" >


          {(totalWaves > 0) && <h2>Total Waves: {totalWaves} Thanks!💓</h2>}




        </div>



        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}

      </div>
    </div>
  );
}

export default App