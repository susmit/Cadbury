import React from 'react'
import Webcam from 'react-webcam'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import { Link } from 'react-router-dom'
import pinataL from '../pinata.png'
import textileLogo from '../textile.png'
import libp2pL from '../libp2p.png'
import ethLogo from '../eth.png'
import ipfsLogo from '../ipfs.png'
import fleekLogo from '../fleek-logo.png'
import logo from '../logo.svg'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  paper: {
    padding: theme.spacing(0.5),
    textAlign: 'center',
    borderRadius: 10,
    color: theme.palette.text.secondary,
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  },
  butt: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 20,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 45,
    padding: '0 30px',
  },
}))

function Home() {
  const classes = useStyles()
  return (
    <div className="column">
      {/* <h1>Welcome to Cadbury 🍫 !</h1> */}
      <div className={classes.root}>
        <Grid container spacing={2} alignItems="center" justify="center">
          <Grid item xs>
            <Paper className={classes.paper}>
              <Webcam height={400} />
            </Paper>
          </Grid>
          <Grid item xs>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{ height: '428px',width: '500px' }}
            >
              <div className="column" justify="center">
                <h3>Meeting ready</h3>
                {/* <div className="row" justify="center">
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
                </div> */}
                <br></br>
                <Link to="/meet">
                  <Button variant="contained" className={classes.butt}>
                    Join now
                  </Button>
                </Link>
              </div>
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Home
