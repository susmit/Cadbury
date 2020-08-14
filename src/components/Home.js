import React from 'react'
import './Component.css'
import Button from '@material-ui/core/Button'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Fab from '@material-ui/core/Fab'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import Box from '@material-ui/core/Box'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInputBase-root.Mui-disabled': {
      color: 'white',
    },
    '& .MuiFormLabel-root.Mui-disabled': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red',
      },
      '&:hover fieldset': {
        borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
  },
})(TextField)

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  gtext: {
    color: '#9c7e46',
  },
  paper: {
    padding: theme.spacing(0.5),
    textAlign: 'center',
    borderRadius: 10,
    color: theme.palette.text.secondary,
    background: 'linear-gradient(45deg, #9c7e46 30%, #CBB386 90%)',
  },
  butt: {
    background: 'linear-gradient(45deg, #9c7e46 30%, #CBB386 90%)',
    border: 0,
    borderRadius: 20,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 45,
    padding: '0 30px',
  },
  abutt: {
    background: 'linear-gradient(45deg, #9c7e46 30%, #CBB386 90%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    margin: theme.spacing(1),
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  },
}))

function Home(props) {
  const classes = useStyles()

  return (
    <div className="column">
      <div id="topleft">
        <Typography variant="h5" className={classes.gtext}>
          🍫 Cadbury Meet
        </Typography>
      </div>
      <div className={classes.root}>
        <Grid container spacing={2} alignItems="center" justify="center">
          <Grid item xs>
            <div></div>
          </Grid>
          <Grid item xs>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              style={{ height: '428px', width: '500px' }}
            >
              <div className="column" justify="center">
                <h3>Meeting ready</h3>
                <CssTextField
                  type="text"
                  name="room"
                  value={props.roomId}
                  onChange={props.handleChange}
                  label="Id"
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

Home.propTypes = {
  handleChange: PropTypes.func.isRequired,
  defaultRoomId: PropTypes.string.isRequired,
  roomId: PropTypes.string.isRequired,
  rooms: PropTypes.array.isRequired,
}

const mapStateToProps = (store) => ({ rooms: store.rooms })

export default connect(mapStateToProps)(Home)
