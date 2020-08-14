import React from 'react'
import './Component.css'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Rating from '@material-ui/lab/Rating'
import Box from '@material-ui/core/Box'
import { CADBURY_ABI, CADBURY_ADDRESS } from '../config'

const Web3 = require('web3')

const labels = {
  1: 'Fine',
  2: 'Ok',
  3: 'Good',
  4: 'Awesome',
  5: 'Excellent',
}

const useStyles = makeStyles((theme) => ({
  ratings: {
    width: 200,
    display: 'flex',
    alignItems: 'center',
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(0.5),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    background: 'linear-gradient(45deg, #9c7e46 30%, #CBB386 90%)',
  },
  butt: {
    background: 'linear-gradient(45deg, #9c7e46 30%, #CBB386 90%)',
    border: 0,
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 45,
    padding: '0 30px',
  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    transition: '0.3s',
    boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
    '&:hover': {
      boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)',
    },
  },
  gtext: {
    color: '#9c7e46',
  },
  media: {
    paddingTop: '56.25%',
  },
}))

async function yoyo(val) {
  try {
    window.ethereum.enable()
    const web3 = new Web3(Web3.givenProvider)
    const accounts = await web3.eth.getAccounts()
    console.log(accounts[0])
    const CadburySmc = new web3.eth.Contract(CADBURY_ABI, CADBURY_ADDRESS)
    console.log(CadburySmc.options.address)
    const total = await CadburySmc.methods.totalPeople().call()
    console.log(total)
    const ratings = await CadburySmc.methods.GetRatings().call()
    console.log(ratings)
    const rating = await CadburySmc.methods
      .rate(val)
      .send({ from: accounts[0] })
    console.log(rating)
  } catch (e) {}
}

function Disconnected(props) {
  const classes = useStyles()
  const [value, setValue] = React.useState(5)
  const [hover, setHover] = React.useState(-1)
  return (
    <div className="App">
      <header className="App-header">
        <div className="column">
          <div id="topleft">
            <Typography variant="h5" className={classes.gtext}>
              🍫 Cadbury Meet
            </Typography>
          </div>
          <h2>Disengaged</h2>
          <p>How was the meeting ? (kovan) </p>
          <br />
          <br />
          <div className={classes.ratings}>
            <Rating
              name="hover-feedback"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue)
                if (!window.ethereum || !window.ethereum.isMetaMask) {
                  alert(
                    'Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!',
                  )
                }
                try {
                  yoyo(newValue)
                } catch (e) {
                  alert('error')
                }
                console.log(newValue)
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover)
              }}
            />
            {value !== null && (
              <Box ml={5}>{labels[hover !== -1 ? hover : value]}</Box>
            )}
          </div>
        </div>
      </header>
    </div>
  )
}

export default Disconnected
