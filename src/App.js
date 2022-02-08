import * as React from "react";
import './App.css';

export default function App() {

  const wave = () => {

  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">

        <div className="header">
          Welcome to my <span role="img" aria-label="Snowman">👋</span> Page!
        </div> 

       
        <div className="bio">
          I am Efrain and I'm gonna create amazing projects on Web3 !
        </div>

        
       

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
      </div>
    </div>
  );
}
