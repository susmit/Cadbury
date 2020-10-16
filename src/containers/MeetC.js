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
import Popover from '@material-ui/core/Popover'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import PauseIcon from '@material-ui/icons/Pause'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import { JobStatus } from "@textile/grpc-powergate-client/dist/ffs/rpc/rpc_pb"
import CircularProgress from '@material-ui/core/CircularProgress'
import { green } from '@material-ui/core/colors'

import { RecordRTCPromisesHandler, invokeSaveAsDialog } from 'recordrtc'
const Box = require('3box')
const Web3 = require('web3')
const host = 'https://webapi.pow.cadbury.textile.io'

let recorder

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function getFileName(fileExtension) {
  var d = new Date();
  var year = d.getUTCFullYear();
  var month = d.getUTCMonth();
  var date = d.getUTCDate();
  return 'Cadbury-' + year + month + date + '-' + getRandomString() + '.' + fileExtension;
}


function getRandomString() {
  if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
      var a = window.crypto.getRandomValues(new Uint32Array(3)),
          token = '';
      for (var i = 0, l = a.length; i < l; i++) {
          token += a[i].toString(36);
      }
      return token;
  } else {
      return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
  }
}


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
      powSetToken: false,

      //download dialog
      ddialog: false,

      //no download snack
      noDownloadSnack: false,

      //yes download snack
      yesDownloadSnack:false,

    }

    this.serviceIP = 'https://meet-cadbury.herokuapp.com/webrtcPeer'
    this.socket = null
    this.pow = createPow({ host })
  }

  //no download Snack
  handleClick = () => {
    this.setState({ noDownloadSnack: true })
  };

  //no download snack
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ noDownloadSnack: false})
  };

  //download dialog
  openDialog() {
    this.setState({ ddialog: true })
  }

  //download dialog
  closeDialog() {
    this.setState({ ddialog: false })
  }

  //meeting record fc
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

  //meeting record fc
  pauseRecord = async () => {
    console.log('Recording Paused')
    this.setState({
      recordingStatus: 'Recording Paused',
    })
    await recorder.pauseRecording()
  }

  //meeting record fc
  stopRecord = async () => {
    console.log('Recording Stopped')
    await recorder.stopRecording()
    this.setState({
      recordingStatus: 'Recording Stopped',
    })
    let blob = await recorder.getBlob()
    var fileName = getFileName('webm');
    invokeSaveAsDialog(blob, fileName)
  }

  // textile powergate fc //ffs login //time consuming
  handleFFS = async () => {

    if(this.state.powSetToken){
      console.log("pow token already set")
      return ;
    }else{
      console.log("pow not set")
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

    // if (!Box.isLoggedIn(accounts[0])) {
    //   console.log('Not Logged In')
    //   // box = await Box.openBox(accounts[0], window.ethereum)
    // }
    let box
    try {
      box = await Box.openBox(accounts[0], window.ethereum)
    } catch (e) {
      console.log(e)
    }
    await box.syncDone
    console.log('3box sync done')
    //else {
    // console.log('user logged in!')
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
      this.setState({
        powSetToken: true,
      })
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
      this.setState({
        powSetToken: true,
      })
      // const info = await this.pow.ffs.info()
      // console.log(JSON.stringify(info.info))
      await box.logout()
      // alert(
      //   this.state.listenAddr +
      //     '\nUser Powergate FFS token:- ' +
      //     ffsToken +
      //     '\nUser Address:- ' +
      //     accounts[0],
      // )
    }

    //const box = await Box.openBox(0x234..., window.ethereum)
  }

  //textile powergate fc
  getPowergateStatus = async () => {
    try {
      const [respAddr, respHealth] = await Promise.all([
        this.pow.net.listenAddr(),
        this.pow.health.check(),
      ])
      //console.log('powergate ' + JSON.stringify(respPeers.peersList))
      console.log('powergate ' + JSON.stringify(respAddr.addrInfo))
      console.log('powergate ' + JSON.stringify(respHealth))
      //console.log('powergate ' + JSON.stringify(respMiners.index))
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

  //textile powergarte fc
  getFFSAddrs = async () => {
    const { addrsList } = await this.pow.ffs.addrs()
    console.log(addrsList)
    //set state
  }

  //textile powergate fc
  createWalletAddr = () => async () => {
    const { addr } = await this.pow.ffs.newAddr("Cadbury-Filecoin", "bls", false);}

  //textile powergate fc
  getFFSInfo = async () => {
    const { info } = await this.pow.ffs.info()
    console.log(info)
  }

  //textile powergate fc
  getDefaultCidConfig = (cid) => async () => {
    await this.pow.ffs.getDefaultCidConfig(cid)
  }

  //textile powergate fc
  setDefaultConfig = (defaultConfig) => async () => {
    console.log(defaultConfig);
    await this.pow.ffs.setDefaultConfig(defaultConfig);
  };

  //textile powergate fc
  uploadToFFS = async () => {

    console.log("1 ffs filecoin upload initiated")


    console.log('Recording Stopped')
    await recorder.stopRecording()
    this.setState({
      recordingStatus: 'Recording Stopped',
    })
    let blob = await recorder.getBlob()

     // generating a random file name
     var fileName = getFileName('webm');

     // we need to upload "File" --- not "Blob"
     var fileObject = new File([blob], fileName, {
         type: 'video/webm'
     });

     var arrayBuffer, uint8Array;
     var fileReader = new FileReader();
     fileReader.readAsArrayBuffer(fileObject);

     fileReader.onload = async () => {
      arrayBuffer = this.result;
      uint8Array = new Uint8Array(arrayBuffer);
           // cache data in IPFS in preparation to store it using FFS
      //const buffer = "fs.readFileSync(`path/to/a/file`)"
      const { cid } = await this.pow.ffs.stage(uint8Array)

      console.log("2 uploaded to IPFS")
      console.log(cid)


      // store the data in FFS using the default storage configuration
      const { jobId } = await this.pow.ffs.pushStorageConfig(cid)

      console.log("3 Pushed to filecoin network bia ffs cold")
      console.log(jobId)
    }


    // const jobsCancel = this.pow.ffs.watchJobs((job) => {
    //   if (job.status === JobStatus.JOB_STATUS_CANCELED) {
    //     console.log("job canceled")
    //   } else if (job.status === JobStatus.JOB_STATUS_FAILED) {
    //     console.log("job failed")
    //   } else if (job.status === JobStatus.JOB_STATUS_SUCCESS) {
    //     console.log("job success!")
    //   }
    // }, jobId)
  

    // // watch all FFS events for a cid
    // const logsCancel = this.pow.ffs.watchLogs((logEvent) => {
    //   console.log(`received event for cid ${logEvent.cid}`)
    // }, cid)

  

  };
  
  //textile powergate fc
  getCidConfig = (payload) => async (dispatch) => {
    const { config } = await this.pow.ffs.getCidConfig(payload.cid);
    console.log({ getCidConfig: config });
    // dispatch({
    //   type: types.GET_CID_CONFIG,
    //   payload: {
    //     cid: payload.cid,
    //     desiredConfig: config,
    //   },
    // });
  };
  
  //textile powergate fc
  getActualCidConfig = (payload) => async (dispatch) => {
    const { cidInfo } = await this.pow.ffs.show(payload.cid);
    console.log({ getActualCidConfig: cidInfo });
    // dispatch({
    //   type: types.GET_ACTUAL_CID_CONFIG,
    //   payload: {
    //     cid: payload.cid,
    //     cidInfo: cidInfo,
    //   },
    // });
  };
  
  //textile powergate fc
  getDataFromFFS = (payload) => async (dispatch) => {
    const bytes = await this.pow.ffs.get(payload.cid);
    console.log(bytes);
  
    let blob = new Blob([bytes], { type: "octet/stream" });
    let url = window.URL.createObjectURL(blob);
  
    // dispatch({
    //   type: types.GET_DATA_FROM_FFS,
    //   payload: {
    //     cid: payload.cid,
    //     url: url,
    //   },
    // });
  };
  
  //textile powergate fc
  sendFIL = (payload) => async (dispatch) => {
    await this.pow.ffs.sendFil(
      payload.addrsList[0].addr,
      "<some other address>",
      1000
    );
    // dispatch({
    //   type: types.GET_DATA_FROM_FFS,
    //   payload: {
    //     from: payload.addrsList[0].addr,
    //     to: "<some other address>",
    //     amount: 1000,
    //   },
    // });
  };


  // webrtc 
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
        {/* <Draggable> */}
          <div
            style={{
              zIndex: 100,
              position: 'absolute',
              left: 0,
              bottom: 100,
              //cursor: 'pointer',
              //padding: 30,
            }}
          >
            <Video
              videoStyles={{
                width: 200,
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
        {/* </Draggable> */}
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
                : 'Textile Powergate :- Offline'}
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
                console.log('download dialog initiated')
                this.openDialog()
              }}
              aria-label="Call End"
            >
              <SaveAltIcon />
            </Fab>
            <Dialog
              open={this.state.ddialog}
              onClose={() => {
                this.closeDialog()
              }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {'Use Cadbury storage service?'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  With Cadbury storage service you can upload recorded meeting
                  to FILECOIN NETWORK or IPFS within single click. Recorded
                  meeting can also be downloaded as per your convenience.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    if (this.state.recordingStatus !== null) {
                      this.stopRecord()
                      this.closeDialog()
                    }
                    //this.closeDialog()
                    //for no download snack
                    this.handleClick()
                  }}
                  color="primary"
                >
                  Download
                </Button>
                <Snackbar open={this.state.noDownloadSnack} autoHideDuration={3000} onClose={()=>this.handleClose()}>
                    <Alert onClose={()=>this.handleClose()} severity="warning">
                      No meeting recording found !
                    </Alert>
                  </Snackbar>
                {/* <Button
                  onClick={() => {
    
                      this.closeDialog()
          
                  }}
                  color="primary"
                >
                  Ipfs
                </Button> */}
                <Button
                  onClick={async () => {

                    if (this.state.recordingStatus !== null) {
                      // stop recording logic
                      await this.handleFFS()
                      await this.uploadToFFS()
                      await this.closeDialog()
                    }
                     // no meeting recording foung
                      //this.closeDialog()
                      //for no download snack
                    this.handleClick()
           
                  }}
                  color="primary"
                  autoFocus
                >
                  Filecloud
                </Button>
              </DialogActions>
            </Dialog>
          </i>
          <Fab
            color="primary"
            onClick={async () => {
              console.log('FFS info initiated')
              await this.handleFFS()
              await this.getFFSInfo()
              await this.getFFSAddrs()
              //this.handleFFS()
            }}
            aria-label="Call End"
          >
            <DashboardIcon />
          </Fab>
        </div>
        <div>
          <Videos
            switchVideo={this.switchVideo}
            remoteStreams={this.state.remoteStreams}
          ></Videos>
        </div>
        <br />

        {/* <Draggable> */}
          <div
            style={{
              zIndex: 100,
              position: 'absolute',
              right: 0,
              cursor: 'move',
              top: 1,
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
        {/* </Draggable> */}
      </div>
    )
  }
}

export default MeetC
