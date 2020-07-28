import React from 'react'
import './Landing.css'
import { Link } from 'react-router-dom'
import pinataL from '../pinata.png'
import textileLogo from '../textile.png'
import libp2pL from '../libp2p.png'
import ethLogo from '../eth.png'
import ipfsLogo from '../ipfs.png'
import fleekLogo from '../fleek-logo.png'
import logo from '../logo.svg'
import meeting from '../meeting.jpg'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(0.5),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  },
  butt: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 45,
    padding: '0 30px',
  },
  card: {
    maxWidth: 600,
    margin: "auto",
    transition: "0.3s",
    boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)"
    }
  },
  media: {
    paddingTop: "56.25%"
  },
}))

function Landing() {
  const classes = useStyles()
  return (
    <div className="column">
    <div id="topleft"><p>🍫 Cadbury Meet</p></div>
      
      <div className={classes.root}>
        <Grid container spacing={2} alignItems="center" justify="center">
          <Grid item xs>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{ height: '428px',width: '700px' }}
            >
              <div className="column" justify="center">
                <h2>Premium video meetings</h2>
                <h3>Now powered by web 3</h3>
                <p>We have engineered the service for meetings to be open, neutral, bodorless, decentralized and censorship resistance for all</p>
                <div className="row" justify="center">
                  <img src={ipfsLogo} className="Fleek-logo" alt="fleek-logo" />
                  <img src={libp2pL} className="Fleek-logo" alt="fleek-logo" />
                  <img src={ethLogo} className="eth-logo" alt="fleek-logo" />
                  <img src={logo} className="App-logo" alt="logo" />
                  <img src={pinataL} className="Fleek-logo" alt="fleek-logo" />
                  <img
                    src={textileLogo}
                    className="Fleek-logo"
                    alt="fleek-logo"
                  />
                  <img
                    src={fleekLogo}
                    className="Fleek-logo"
                    alt="fleek-logo"
                  />
                </div>
                <br></br>
                <Link to="/home">
                  <Button variant="contained" className={classes.butt}>
                    Start
                  </Button>
                </Link>
              </div>
            </Box>
          </Grid>
          <Grid item xs>
            <Paper className={classes.paper}><img src={meeting} alt="meet-logo" /></Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Landing
