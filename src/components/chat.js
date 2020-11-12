import React, { useState, useEffect, useRef } from 'react'
import TextField from '@material-ui/core/TextField'
import Collapse from '@material-ui/core/Collapse'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { makeStyles } from '@material-ui/core/styles'
import DragDrop from './dragDrop'

const useStyles = makeStyles((theme) => ({
  root: {
    //padding: '6px 2px',
    display: 'flex',
    alignItems: 'center',
    width: 300,
    background: '#2e2e2e',
    borderRadius: 10,
    paddingTop: 10,
    '& > *': {
      margin: theme.spacing(1),
      // width: '310',
    },
  },
}))

const Chat = (props) => {
  const [message, setMessage] = useState('')
  const [user, setUser] = useState({ uid: 0 })
  const [imageZoom, setImageZoom] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [checked, setChecked] = React.useState(false)
  const classes = useStyles()

  const handleChangeSwitch = () => {
    setChecked((prev) => !prev)
  }

  const scrollToBottom = () => {
    const chat = document.getElementById('chatList')
    chat.scrollTop = chat.scrollHeight
  }

  useEffect(() => {
    scrollToBottom()
    setUser({ uid: props.user.uid })
  }, [props])

  const sendMessage = (msg) => {
    props.sendMessage(msg)
    scrollToBottom()
  }

  const handleSubmit = (event) => {
    if (message === '') return
    event.preventDefault()
    sendMessage({
      type: 'text',
      message: {
        id: user.uid,
        sender: { uid: user.uid },
        data: { text: message },
      },
    })
    setMessage('')
  }

  const handleChange = (event) => {
    setMessage(event.target.value)
  }

  const renderMessage = (userType, data) => {
    const { message } = data

    const msgDiv = (data.type === 'text' && (
      <div className="msg">
        <p>Peer ({message.sender.uid.slice(24, -1)}) </p>
        <div className="message"> {message.data.text}</div>
      </div>
    )) || (
      <div className="msg">
        <p>{message.sender.uid}</p>
        <img
          onClick={() => {
            setImageZoom(true)
            setSelectedImage(message.data)
          }}
          className="message"
          style={{
            width: 200,
            cursor: 'pointer',
          }}
          src={message.data}
        />
      </div>
    )

    return <li className={userType}>{msgDiv}</li>
  }

  const showEnlargedImage = (data) => (
    <img
      src={data}
      style={{
        backgroundColor: 'black',
        background: 'linear-gradient(45deg, #9c7e46 30%, #CBB386 90%)',
        position: 'relative',
        zIndex: 100,
        display: 'block',
        cursor: 'pointer',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 20,
        borderRadius: 20,
      }}
      onClick={() => setImageZoom(false)}
    />
  )

  return (
    <div>
      {imageZoom && showEnlargedImage(selectedImage)}
      <div
        className="chatHeader"
        style={{
          zIndex: 1,
          position: 'fixed',
          // background: '#9C7E46',
          right: 30,
          height: 40,
        }}
      >
        <FormControlLabel
          labelPlacement="start"
          control={
            <Switch
              checked={checked}
              onChange={handleChangeSwitch}
              color="white"
            />
          }
        />
      </div>
      {/* <Collapse in={checked}> */}
      {/* <div
          className="chatWindow"
          style={{
            zIndex: 1,
            position: 'fixed',
            right: 0,
            top: 0,
            bottom: 0,
            width: 350,
            background: '#CBB386',
            height: 650,
          }}
        > */}
      <div
        className="chatHeader"
        style={{
          background: '#2e2e2e',
          height: 40,
          width: 300,
          borderRadius: 10,
          justifyContent: 'center',
        }}
      >
        <div>Chat</div>
      </div>
      <Collapse in={checked}>
        <div
          style={{
            width: 300,
            height: 400,
            borderRadius: 10,
            background: '#2e2e2e',
          }}
        >
          <ul className="chat" id="chatList">
            {props.messages.map((data) => (
              <div key={data.id}>
                {user.uid === data.message.sender.uid
                  ? renderMessage('self', data)
                  : renderMessage('other', data)}
              </div>
            ))}
          </ul>
        </div>

        <DragDrop
          className="chatInputWrapper"
          sendFiles={(files) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              const maximumMessageSize = 262118
              if (e.target.result.length <= maximumMessageSize)
                sendMessage({
                  type: 'image',
                  message: {
                    id: user.uid,
                    sender: { uid: user.uid },
                    data: e.target.result,
                  },
                })
              else alert('Message exceeds Maximum Message Size!')
            }

            reader.readAsDataURL(files[0])
          }}
        >
          <div style={{}}>
            <form
              className={classes.root}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
            >
              <TextField
                id="filled-basic"
                label="Enter Msg/Drop Img"
                fullWidth
                size="small"
                defaultValue="Small"
                color="white"
                onChange={handleChange}
                value={message}
              />
            </form>
          </div>
        </DragDrop>
        {/* </div> */}
      </Collapse>
    </div>
  )
}

export default Chat
