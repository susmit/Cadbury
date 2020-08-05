// https://www.freecodecamp.org/news/building-a-modern-chat-application-with-react-js-558896622194/

import React, { useState, useEffect, useRef } from 'react'
import DragDrop from './dragDrop'
import TextField from '@material-ui/core/TextField'

const Chat = (props) => {
  const [message, setMessage] = useState('')
  const [user, setUser] = useState({ uid: 0 })
  const [imageZoom, setImageZoom] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')

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
    const message = data.message

    const msgDiv = (data.type === 'text' && (
      <div className="msg">
        <p>{message.sender.uid}</p>
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
            // height: 100
            cursor: 'pointer',
          }}
          src={message.data}
        />
      </div>
    )

    return <li className={userType}>{msgDiv}</li>
  }

  const showEnlargedImage = (data) => {
    return (
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
  }

  return (
    <div>
      {imageZoom && showEnlargedImage(selectedImage)}

      <div
        className="chatWindow"
        style={{
          zIndex: 10,
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 350,
          background: 'linear-gradient(45deg, #9c7e46 30%, #CBB386 90%)',
          // height: 650,
        }}
      >
        <div className = "chatHeader"
          style={{
            background: 'white',
            height: 50,
          }}
        >
          {' '}
          Chat Section
        </div>
        <ul className="chat" id="chatList">
          {props.messages.map((data) => (
            <div key={data.id}>
              {user.uid === data.message.sender.uid
                ? renderMessage('self', data)
                : renderMessage('other', data)}
            </div>
          ))}
        </ul>
        <DragDrop
          className="chatInputWrapper"
          sendFiles={(files) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              //https://blog.mozilla.org/webrtc/large-data-channel-messages/
              //https://lgrahl.de/articles/demystifying-webrtc-dc-size-limit.html
              const maximumMessageSize = 262118 //65535 <=== 64KiB // 16384 <=== 16KiB to be safe
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
          <div className = "inputChat" style={{ position: 'absolute', bottom: '0px',width :350,borderRadius: 10}}>
            <form onSubmit={handleSubmit}>
              <TextField
                className="textarea input"
                type="text"
                placeholder="Enter your message/drop your image here"
                onChange={handleChange}
                value={message}
              />
            </form>
          </div>
        </DragDrop>
      </div>
    </div>
  )
}

export default Chat
