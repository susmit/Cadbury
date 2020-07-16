import React from 'react';
import logo from './logo.svg';
import fleekLogo from './fleek-logo.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
         Welcome to Cadbury 🍫 !
        </h1>
        <a>
          Meetings powered by web3
        </a>
        <img src={logo} className="App-logo" alt="logo" />
        <span className="Big-plus">+</span>
        <img src={fleekLogo} className="Fleek-logo" alt="fleek-logo" />
      </header>
    </div>
  );
}

export default App;
