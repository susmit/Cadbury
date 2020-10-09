import React, { Component } from 'react'

import io from 'socket.io-client'

import Video from '../components/video'
import Videos from '../components/videos'
import Chat from '../components/chat'
import Draggable from 'react-draggable'
import Disconnected from '../components/Disconnected'
import { makeStyles } from '@material-ui/core/styles'
import CallEndIcon from '@material-ui/icons/CallEnd'
import Fab from '@material-ui/core/Fab'
import PeopleIcon from '@material-ui/icons/People'
import Badge from '@material-ui/core/Badge'
import Typography from '@material-ui/core/Typography'
import { createPow } from '@textile/powergate-client'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import PlayForWorkIcon from '@material-ui/icons/PlayForWork'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import PauseIcon from '@material-ui/icons/Pause'

import { RecordRTCPromisesHandler, invokeSaveAsDialog } from 'recordrtc'

const Box = require('3box')
const Web3 = require('web3')
const host = 'https://webapi.pow.cadbury.textile.io'

const useStyles = makeStyles({
  root: {
    width: 500,
  },
})

let recorder

//97aa579e-92c4-4f1a-a9f1-521ae26f4dbe  id 8a8c9644-8e7e-45ec-a704-eb6b7c906f86
// > Success! Staged asset in FFS hot storage with cid: QmWkkcMJLKV9TdsHjtPiuJwYSR43JaEsHVAGYqc4Jg4fm7
// cli > Instance created with id 9c980d48-cabc-4241-9775-7c72629d842f and token b82e3869-4a3a-4bde-912e-6ea055723d11

class MeetC extends Component {
  constructor(props) {
    super(props)

    this.state = {
      localStream: null,
      remoteStream: null,
      remoteStreams: [],
      peerConnections: {},
      selectedVideo: null,
      status: 'Share code/link with attendees',

      pc_config: {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302',
          },
        ],
      },

      sdpConstraints: {
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true,
        },
      },

      messages: [],
      sendChannels: [],
      disconnected: false,

      listenAddr: '',
      powergateStatus: false,
      recordingStatus: null,
      isRecord: true,
    }

    this.serviceIP = 'https://meet-cadbury.herokuapp.com/webrtcPeer'
    this.socket = null
    this.pow = createPow({ host })
  }

  startRecord = async () => {
    if (
      this.state.recordingStatus === null ||
      this.state.recordingStatus === 'Recording Stopped'
    ) {
      console.log('Recording Started')
      //   recorder = new RecordRTCPromisesHandler([...this.state.remoteStreams,this.state.localStream], {
      //     mimeType: 'video/webm',
      // });
      if (this.state.remoteStream === null) {
        recorder = new RecordRTCPromisesHandler([this.state.localStream], {
          mimeType: 'video/webm',
        })
      } else {
        recorder = new RecordRTCPromisesHandler(
          [this.state.localStream, this.state.remoteStream],
          {
            mimeType: 'video/webm',
          },
        )
      }
      recorder.startRecording()
    } else {
      console.log('Recording Resumed')
      await recorder.resumeRecording()
    }

    this.setState({
      recordingStatus: 'Recording On ...',
    })
  }

  pauseRecord = async () => {
    console.log('Recording Paused')
    this.setState({
      recordingStatus: 'Recording Paused',
    })
    await recorder.pauseRecording()
  }

  stopRecord = async () => {
    console.log('Recording Stopped')
    await recorder.stopRecording()
    this.setState({
      recordingStatus: 'Recording Stopped',
    })
    let blob = await recorder.getBlob()
    invokeSaveAsDialog(blob, 'cadbury-record.webm')
  }

  handleFFS = async () => {
    if (this.state.recordingStatus !== null) {
      this.stopRecord()
    }
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      alert(
        'Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!',
      )
    }
    window.ethereum.enable()
    const web3 = new Web3(Web3.givenProvider)
    const accounts = await web3.eth.getAccounts()
    console.log(accounts[0])
    if (!Box.isLoggedIn(accounts[0])) {
      console.log('Not Logged In')
      // box = await Box.openBox(accounts[0], window.ethereum)
    }
    let box = await Box.openBox(accounts[0], window.ethereum)
    await box.syncDone
    //else {
    //   console.log('user logged in!')
    const ffsToken = await box.private.get('ffsToken')
    console.log(ffsToken)
    if (typeof ffsToken === 'undefined' || !ffsToken) {
      console.log("user doesn't have FFS token")
      if (!this.state.powergateStatus) {
        alert(
          'Textile Powergate offline ' +
            host +
            '\nUser Powergate FFS token:- ' +
            'Not Assigned ' +
            '\nUser Address ' +
            accounts[0],
        )
        await box.logout()
        return
      }
      const createResp = await this.pow.ffs.create()
      await box.private.set('ffsToken', createResp.token)
      //user.ffsToken = createResp.token
      //await save(user)
      this.pow.setToken(createResp.token)
      console.log('user token generated,saved in 3box and pow set')
      console.log(createResp.token)
      box.logout()
      alert('try again')
    } else {
      console.log('user has FFS token')
      if (!this.state.powergateStatus) {
        alert(
          'Textile Powergate offline ' +
            host +
            '\nUser Powergate FFS token:- ' +
            ffsToken +
            '\nUser Address ' +
            accounts[0],
        )
        await box.logout()
        return
      }
      this.pow.setToken(ffsToken)
      const info = await this.pow.ffs.info()
      console.log(JSON.stringify(info.info))
      await box.logout()
      alert(
        this.state.listenAddr +
          '\nUser Powergate FFS token:- ' +
          ffsToken +
          '\nUser Address:- ' +
          accounts[0],
      )
    }

    //const box = await Box.openBox(0x234..., window.ethereum)
  }

  getPowergateStatus = async () => {
    try {
      const [respPeers, respAddr, respHealth, respMiners] = await Promise.all([
        this.pow.net.peers(),
        this.pow.net.listenAddr(),
        this.pow.health.check(),
        this.pow.miners.get(),
      ])
      console.log('powergate ' + JSON.stringify(respPeers.peersList))
      console.log('powergate ' + JSON.stringify(respAddr.addrInfo))
      console.log('powergate ' + JSON.stringify(respHealth))
      console.log('powergate ' + JSON.stringify(respMiners.index))
      this.setState({
        listenAddr: 'Textile Powergate:- ' + respAddr.addrInfo.id,
        powergateStatus: true,
      })
    } catch (e) {
      console.log('Powergate 404')
      this.setState({
        listenAddr: 'Textile Powergate Offline (Testnet)',
        powergateStatus: false,
      })
      console.log(e)
    }
  }

  getLocalStream = () => {
    const success = (stream) => {
      window.localStream = stream
      this.setState({
        localStream: stream,
      })

      this.whoisOnline()
    }
    const failure = (e) => {
      console.log('getUserMedia Error: ', e)
    }

    const constraints = {
      audio: true,
      video: true,
      options: {
        mirror: true,
      },
    }

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(success)
      .catch(failure)
  }

  whoisOnline = () => {
    this.sendToPeer('onlinePeers', null, { local: this.socket.id })
  }

  sendToPeer = (messageType, payload, socketID) => {
    this.socket.emit(messageType, {
      socketID,
      payload,
    })
  }

  createPeerConnection = (socketID, callback) => {
    try {
      let pc = new RTCPeerConnection(this.state.pc_config)

      const peerConnections = { ...this.state.peerConnections, [socketID]: pc }
      this.setState({
        peerConnections,
      })

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          this.sendToPeer('candidate', e.candidate, {
            local: this.socket.id,
            remote: socketID,
          })
        }
      }

      pc.oniceconnectionstatechange = (e) => {}

      pc.ontrack = (e) => {
        let _remoteStream = null
        let remoteStreams = this.state.remoteStreams
        let remoteVideo = {}

        const rVideos = this.state.remoteStreams.filter(
          (stream) => stream.id === socketID,
        )

        if (rVideos.length) {
          _remoteStream = rVideos[0].stream
          _remoteStream.addTrack(e.track, _remoteStream)
          remoteVideo = {
            ...rVideos[0],
            stream: _remoteStream,
          }
          remoteStreams = this.state.remoteStreams.map((_remoteVideo) => {
            return (
              (_remoteVideo.id === remoteVideo.id && remoteVideo) ||
              _remoteVideo
            )
          })
        } else {
          _remoteStream = new MediaStream()
          _remoteStream.addTrack(e.track, _remoteStream)

          remoteVideo = {
            id: socketID,
            name: socketID,
            stream: _remoteStream,
          }
          remoteStreams = [...this.state.remoteStreams, remoteVideo]
        }

        this.setState((prevState) => {
          const remoteStream =
            prevState.remoteStreams.length > 0
              ? {}
              : { remoteStream: _remoteStream }

          let selectedVideo = prevState.remoteStreams.filter(
            (stream) => stream.id === prevState.selectedVideo.id,
          )

          selectedVideo = selectedVideo.length
            ? {}
            : { selectedVideo: remoteVideo }

          return {
            ...selectedVideo,

            ...remoteStream,
            remoteStreams,
          }
        })
      }

      pc.close = () => {}

      if (this.state.localStream)
        this.state.localStream.getTracks().forEach((track) => {
          pc.addTrack(track, this.state.localStream)
        })

      callback(pc)
    } catch (e) {
      console.log('Something went wrong! pc not created!!', e)

      callback(null)
    }
  }

  componentDidMount = () => {
    this.socket = io.connect(this.serviceIP, {
      path: '/io/webrtc',
      query: {
        room: window.location.pathname,
      },
    })

    this.socket.on('connection-success', (data) => {
      this.getLocalStream()

      console.log(data.success)
      const status =
        data.peerCount > 1
          ? `${window.location.pathname}: ${data.peerCount} Peers`
          : 'Share code/link with other peers to connect'

      this.setState({
        status: status,
        messages: data.messages,
      })
    })

    this.socket.on('joined-peers', (data) => {
      this.setState({
        status:
          data.peerCount > 1
            ? `${window.location.pathname}: ${data.peerCount} Peers`
            : 'Share code/link with other peers to connect',
      })
    })

    this.socket.on('peer-disconnected', (data) => {
      console.log('peer-disconnected', data)

      const remoteStreams = this.state.remoteStreams.filter(
        (stream) => stream.id !== data.socketID,
      )

      this.setState((prevState) => {
        const selectedVideo =
          prevState.selectedVideo.id === data.socketID && remoteStreams.length
            ? { selectedVideo: remoteStreams[0] }
            : null

        return {
          remoteStreams,
          ...selectedVideo,
          status:
            data.peerCount > 1
              ? `${window.location.pathname}: ${data.peerCount} Peers`
              : 'Share code/link with other peers to connect',
        }
      })
    })

    this.socket.on('online-peer', (socketID) => {
      console.log('connected peers ...', socketID)

      this.createPeerConnection(socketID, (pc) => {
        if (pc) {
          const handleSendChannelStatusChange = (event) => {
            console.log(
              'send channel status: ' + this.state.sendChannels[0].readyState,
            )
          }

          const sendChannel = pc.createDataChannel('sendChannel')
          sendChannel.onopen = handleSendChannelStatusChange
          sendChannel.onclose = handleSendChannelStatusChange

          this.setState((prevState) => {
            return {
              sendChannels: [...prevState.sendChannels, sendChannel],
            }
          })

          const handleReceiveMessage = (event) => {
            const message = JSON.parse(event.data)
            console.log(message)
            this.setState((prevState) => {
              return {
                messages: [...prevState.messages, message],
              }
            })
          }

          const handleReceiveChannelStatusChange = (event) => {
            if (this.receiveChannel) {
              console.log(
                "receive channel's status has changed to " +
                  this.receiveChannel.readyState,
              )
            }
          }

          const receiveChannelCallback = (event) => {
            const receiveChannel = event.channel
            receiveChannel.onmessage = handleReceiveMessage
            receiveChannel.onopen = handleReceiveChannelStatusChange
            receiveChannel.onclose = handleReceiveChannelStatusChange
          }

          pc.ondatachannel = receiveChannelCallback

          pc.createOffer(this.state.sdpConstraints).then((sdp) => {
            pc.setLocalDescription(sdp)

            this.sendToPeer('offer', sdp, {
              local: this.socket.id,
              remote: socketID,
            })
          })
        }
      })
    })

    this.socket.on('offer', (data) => {
      this.createPeerConnection(data.socketID, (pc) => {
        pc.addStream(this.state.localStream)

        const handleSendChannelStatusChange = (event) => {
          console.log(
            'send channel status: ' + this.state.sendChannels[0].readyState,
          )
        }

        const sendChannel = pc.createDataChannel('sendChannel')
        sendChannel.onopen = handleSendChannelStatusChange
        sendChannel.onclose = handleSendChannelStatusChange

        this.setState((prevState) => {
          return {
            sendChannels: [...prevState.sendChannels, sendChannel],
          }
        })

        const handleReceiveMessage = (event) => {
          const message = JSON.parse(event.data)
          console.log(message)
          this.setState((prevState) => {
            return {
              messages: [...prevState.messages, message],
            }
          })
        }

        const handleReceiveChannelStatusChange = (event) => {
          if (this.receiveChannel) {
            console.log(
              "receive channel's status has changed to " +
                this.receiveChannel.readyState,
            )
          }
        }

        const receiveChannelCallback = (event) => {
          const receiveChannel = event.channel
          receiveChannel.onmessage = handleReceiveMessage
          receiveChannel.onopen = handleReceiveChannelStatusChange
          receiveChannel.onclose = handleReceiveChannelStatusChange
        }

        pc.ondatachannel = receiveChannelCallback

        pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(
          () => {
            pc.createAnswer(this.state.sdpConstraints).then((sdp) => {
              pc.setLocalDescription(sdp)

              this.sendToPeer('answer', sdp, {
                local: this.socket.id,
                remote: data.socketID,
              })
            })
          },
        )
      })
    })

    this.socket.on('answer', (data) => {
      const pc = this.state.peerConnections[data.socketID]
      console.log(data.sdp)
      pc.setRemoteDescription(
        new RTCSessionDescription(data.sdp),
      ).then(() => {})
    })

    this.socket.on('candidate', (data) => {
      const pc = this.state.peerConnections[data.socketID]

      if (pc) pc.addIceCandidate(new RTCIceCandidate(data.candidate))
    })

    this.getPowergateStatus()
  }

  switchVideo = (_video) => {
    console.log(_video)
    this.setState({
      selectedVideo: _video,
    })
  }

  render() {
    if (this.state.disconnected) {
      this.socket.close()
      this.state.localStream.getTracks().forEach((track) => track.stop())
      return <Disconnected />
    }

    //console.log(this.state.localStream)

    const statusText = (
      <div style={{ color: 'white', padding: 0 }}>{this.state.status}</div>
    )

    return (
      <div>
        <Draggable>
          <div
            style={{
              zIndex: 101,
              position: 'absolute',
              left: 0,
              top: 250,
              cursor: 'move',
              padding: 30,
            }}
          >
            <Video
              videoStyles={{
                width: 300,
              }}
              frameStyle={{
                width: 200,
                margin: 5,
                borderRadius: 10,
                backgroundColor: '#CBB386',
              }}
              showMuteControls={true}
              videoStream={this.state.localStream}
              autoPlay
              muted
            ></Video>
          </div>
        </Draggable>
        <Video
          videoStyles={{
            zIndex: 1,
            position: 'fixed',
            bottom: 0,
            minWidth: '100%',
            minHeight: '100%',
            backgroundColor: '#202040',
          }}
          videoStream={
            this.state.selectedVideo && this.state.selectedVideo.stream
          }
          autoPlay
        ></Video>
        <br />
        <div
          style={{
            zIndex: 3,
            position: 'absolute',
            color: 'white',
            margin: 10,

            padding: 20,
            borderRadius: 5,
          }}
        >
          {' '}
          <div
            style={{
              padding: 10,
            }}
          >
            <Badge color="secondary" variant="dot">
              <PeopleIcon />
            </Badge>
          </div>
          <div
            style={{
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Badge color="secondary" variant="dot">
              <Typography>{statusText}</Typography>
            </Badge>
          </div>
          <div
            style={{
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Typography>
              {this.state.powergateStatus
                ? 'Textile Powergate :- Online'
                : 'Textile Pwergate :- Offline'}
            </Typography>
          </div>
          <div
            style={{
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Typography>{this.state.recordingStatus} </Typography>
          </div>
          <i
            onClick={(e) => {
              if (this.state.recordingStatus !== null) {
                this.stopRecord()
              }
              this.setState({ disconnected: true })
            }}
            style={{
              cursor: 'pointer',
              paddingLeft: 15,
              color: 'red',
              paddingRight: 10,
            }}
            className="material-icons"
          >
            <Fab
              color="secondary"
              onClick={() => {
                console.log('onClick')
              }}
              aria-label="Call End"
            >
              <CallEndIcon />
            </Fab>
          </i>
          <Fab
            color="primary"
            onClick={() => {
              //console.log('Recording meeting')
              this.setState({
                isRecord: !this.state.isRecord,
              })
              if (this.state.isRecord) {
                this.startRecord()
              } else {
                this.pauseRecord()
              }
            }}
            aria-label="Call End"
          >
            {' '}
            {this.state.isRecord ? <PlayArrowIcon /> : <PauseIcon />}
          </Fab>
          <i
            style={{
              cursor: 'pointer',
              paddingLeft: 10,
              color: 'red',
              paddingRight: 10,
            }}
            className="material-icons"
          >
            <Fab
              color="primary"
              onClick={() => {
                console.log('FFS initiated')
                this.handleFFS()
              }}
              aria-label="Call End"
            >
              <SaveAltIcon />
            </Fab>
          </i>
        </div>
        <div>
          <Videos
            switchVideo={this.switchVideo}
            remoteStreams={this.state.remoteStreams}
          ></Videos>
        </div>
        <br />

        <Draggable>
          <div
            style={{
              zIndex: 100,
              position: 'absolute',
              right: 0,
              cursor: 'move',
              top: 0,
            }}
          >
            <Chat
              user={{
                uid: (this.socket && this.socket.id) || '',
              }}
              messages={this.state.messages}
              sendMessage={(message) => {
                this.setState((prevState) => {
                  return { messages: [...prevState.messages, message] }
                })
                this.state.sendChannels.map((sendChannel) => {
                  sendChannel.readyState === 'open' &&
                    sendChannel.send(JSON.stringify(message))
                })
                this.sendToPeer('new-message', JSON.stringify(message), {
                  local: this.socket.id,
                })
              }}
            />
          </div>
        </Draggable>
      </div>
    )
  }
}

export default MeetC
