import React from 'react';
import logo from './logo.svg';
import fleekLogo from './fleek-logo.png';
import ipfsLogo from './ipfs.png';
import ethLogo from './eth.png';
import libp2pL from './libp2p.png';
import textileLogo from './textile.png';
import pinataL from './pinata.png';
import './App.css';
import Webcam from "react-webcam";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(0.5),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
  },
  butt: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div className="App">
      <header className="App-header">
      <div class = "column">
        <h1>
         Welcome to Cadbury 🍫 !
        </h1>
        <div className={classes.root}>
      <Grid container spacing={2} alignItems="center" justify="center">
        <Grid item xs>
          <Paper className={classes.paper}><Webcam height={420}/></Paper>
        </Grid>
        <Grid item xs>
          <Box display="flex"
              justifyContent="center"
              alignItems="center" style={{ height: '428px'}}>
            <div class = "column" justify = "center" >
              <h3>
                Meetings powered by web3
              </h3>
              <div className="row">
                <img src={ipfsLogo} className="Fleek-logo" alt="fleek-logo" />
                <img src={libp2pL} className="Fleek-logo" alt="fleek-logo" />
                <img src={ethLogo} className="eth-logo" alt="fleek-logo" />
                <img src={logo} className="App-logo" alt="logo" />
                <img src={pinataL} className="Fleek-logo" alt="fleek-logo" />
                <img src={textileLogo} className="Fleek-logo" alt="fleek-logo" />
                <img src={fleekLogo} className="Fleek-logo" alt="fleek-logo" />
              </div>
              <br></br>
              <Button variant="contained" className={classes.butt}>Coming Soon</Button>
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
      </div>
      </header>
      
    </div>
  );
}

export default App;
