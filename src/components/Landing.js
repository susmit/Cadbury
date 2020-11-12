import React from 'react'
import './Component.css'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import {
  makeStyles,
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
  withStyles,
} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import ReactGA from 'react-ga'
// import pinataL from '../pinata.png'
// import textileLogo from '../textile.png'
// import libp2pL from '../libp2p.png'
// import ethLogo from '../eth.png'
// import ipfsLogo from '../ipfs.png'
// import fleekLogo from '../fleek-logo.png'
// import logo from '../logo.svg'
import huddle from '../huddle.png'
// import huddlefull from '../huddlefull.png'
// import Avatar from '@material-ui/core/Avatar';

// import BottomNavigation from '@material-ui/core/BottomNavigation'
// import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
// import RestoreIcon from '@material-ui/icons/Restore'
// import FavoriteIcon from '@material-ui/icons/Favorite'
// import LocationOnIcon from '@material-ui/icons/LocationOn'
// import VideocamIcon from '@material-ui/icons/Videocam'
// import MoreVertIcon from '@material-ui/icons/MoreVert';
// import VideocamOffIcon from '@material-ui/icons/VideocamOff'
// import MicIcon from '@material-ui/icons/Mic'
// import MicOffIcon from '@material-ui/icons/MicOff'
// import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
// import ScreenShareIcon from '@material-ui/icons/ScreenShare';
// import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
// import IconButton from '@material-ui/core/IconButton';
// import CameraIcon from '@material-ui/icons/Camera';


import BottomBar from './bottomBar'

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
      opacity: 0.16,
    },
    '& .MuiInputBase-root.Mui-disabled': {
      color: 'white',
      opacity: 0.16,
    },
    '& .MuiFormLabel-root.Mui-disabled': {
      color: 'white',
      opacity: 0.16,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
      opacity: 0.16,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
        opacity: 0.16,
      },
      '&:hover fieldset': {
        borderColor: 'white',
        opacity: 0.16,
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
        opacity: 0.16,
      },
    },
  },
})(TextField)

let theme = createMuiTheme({
  background: '#1565C0',
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
})

theme = responsiveFontSizes(theme)

const useStyles = makeStyles((theme) => ({
  roott: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(22),
      height: theme.spacing(14),
    },},
  root: {
    flexGrow: 1,
  },
  butt: {
    background: '#1565C0',
    borderRadius: 4,
    opacity: 0.7,
    //background: 'linear-gradient(45deg, #2196F3 30%, #90CAF9 90%)',
    //boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 45,
    padding: '0 30px',
  },
  gtextt: {
    color: 'white',
    opacity: 0.75,
  },
  gtext: {
    color: 'white',
    opacity: 0.55,
  },
}))

function Landing(props) {
  const classes = useStyles()
  const [value, setValue] = React.useState(2)

  ReactGA.initialize('UA-177909748-1')
  ReactGA.pageview(window.location.pathname + window.location.search)
  return (
    <div className="App">
      <header className="App-header">
        <div className="column">
          <div id="topleft">
            <img src={huddle} className="Fleek-logo" alt="fleek-logo" />
            <Typography variant="h5" className={classes.gtext}>
              huddle 01
            </Typography>
          </div>
          <div className={classes.root}>
            <Grid container alignItems="flex-start" justify="center">
              <Grid item xs={9}>
                <div className="column" justify="center">
                {/* <div className={classes.roott}>
      <Paper elevation={0} />
      <Paper variant="outlined" />
      <Paper elevation={3} />
    </div> */}
                  <ThemeProvider theme={theme}>
                    <Typography variant="h3" className={classes.gtextt}>
                      Premium video meetings
                    </Typography>
                    <br></br>
                    <Typography variant="body1" className={classes.gtext}>
                      We have engineered the service for meetings to be open,
                      neutral,
                    </Typography>
                    <Typography variant="body1" className={classes.gtext}>
                      borderless, decentralized and censorship resistance for
                      all
                    </Typography>
                  </ThemeProvider>
                </div>
              </Grid>
              <div className={classes.root}>
                <Grid container alignItems="center" justify="center">
                  <Grid item xs>
                    <div className="column" justify="center">
                      <br></br>
                      {/* <h4>Meeting ready</h4> */}
                      <CssTextField
                        type="text"
                        name="room"
                        value={props.roomId}
                        onChange={props.handleChange}
                        label="Meeting Id"
                        variant="outlined"
                        pattern="^\w+$"
                        maxLength="10"
                        required
                        autoFocus
                        title="Room name should only contain letters or numbers."
                      />
                      <div>
                        <br></br>
                      </div>
                      <Link
                        to={`/${props.roomId}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Button variant="contained" className={classes.butt}>
                          huddle
                        </Button>
                      </Link>
                    </div>
                  </Grid>
                </Grid>
              </div>
              
            </Grid>
            
          </div>
        </div>
        {/* <BottomBar /> */}
      </header>
    </div>
  )
}

export default Landing

// | elevation | overlay |   hex   |
// | --------- | ------- | ------- |
// |   00dp    |    0%   | #121212 |
// |   01dp    |    5%   | #1e1e1e |
// |   02dp    |    7%   | #222222 |
// |   03dp    |    8%   | #242424 |
// |   04dp    |    9%   | #272727 |
// |   06dp    |   11%   | #2c2c2c |
// |   08dp    |   12%   | #2e2e2e |
// |   12dp    |   14%   | #333333 |
// |   16dp    |   15%   | #343434 |
// |   24dp    |   16%   | #383838 |
