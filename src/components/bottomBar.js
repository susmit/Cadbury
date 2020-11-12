import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import VideocamIcon from '@material-ui/icons/Videocam'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import ChatBubbleIcon from '@material-ui/icons/ChatBubble'
import ScreenShareIcon from '@material-ui/icons/ScreenShare'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import IconButton from '@material-ui/core/IconButton'
import CameraIcon from '@material-ui/icons/Camera'
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  bottombar: {
    flexGrow: 1,
    position: 'fixed',
    top: 'auto',
    right: 0,
    left: 0,
    bottom: 0,
    background: '#383838',
    //opacity: 0.08,
    color: 'white',
    //boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .9)',
  },
  root: {
    flexGrow: 1,
  },
  butt: {
    background: '#C80A14',
    borderRadius: 4,
	opacity: 0.6,
	height:40,
    //background: 'linear-gradient(45deg, #2196F3 30%, #90CAF9 90%)',
    //boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
  },
  gtextt: {
    color: 'white',
    opacity: 0.75,
  },
  gtext: {
    color: 'white',
    opacity: 0.55,
  },
  rightToolbar: {
    color: 'white',
    opacity: 0.75,
    marginLeft: 'auto',
    marginRight: -12,
  },
  leftAlingBottombar: {
    color: 'white',
    opacity: 0.75,
    marginRight: 16,
    marginLeft: -12,
  },
}))

export default function BottomBar() {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue)
      }}
      showLabels
      className={classes.bottombar}
    >
      <BottomNavigationAction
        className={classes.leftAlingBottombar}
        label="Mute"
        icon={<MicIcon />}
      />
      <BottomNavigationAction
        className={classes.leftAlingBottombar}
        label="Video Off"
        icon={<VideocamIcon />}
      />
      <BottomNavigationAction
        className={classes.rightToolbar}
        label="Share Screen"
        icon={<ScreenShareIcon />}
      />
      <BottomNavigationAction
        className={classes.leftAlingBottombar}
        label="Chat"
        icon={<ChatBubbleIcon />}
      />
      <BottomNavigationAction
        className={classes.leftAlingBottombar}
        label="Record"
        icon={<CameraIcon />}
      />
      <BottomNavigationAction
        className={classes.rightToolbar}
        label="Peers"
        icon={<PeopleAltIcon />}
      />
	  <Button color= "secondary">EXIT</Button>
      {/* <BottomNavigationAction
        className={classes.leftAlingBottombar}
        label="More"
        icon={<MoreVertIcon />}
      /> */}
    </BottomNavigation>
  )
}
