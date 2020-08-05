import React, { Component } from 'react'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'

class Video extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mic: true,
      camera: true,
    }
  }

  componentDidMount() {
    if (this.props.videoStream) {
      this.video.srcObject = this.props.videoStream
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.videoStream)

    if (
      nextProps.videoStream &&
      nextProps.videoStream !== this.props.videoStream
    ) {
      this.video.srcObject = nextProps.videoStream
    }
  }

  mutemic = (e) => {
    const stream = this.video.srcObject
      .getTracks()
      .filter((track) => track.kind === 'audio')
    this.setState((prevState) => {
      if (stream) stream[0].enabled = !prevState.mic
      return { mic: !prevState.mic }
    })
  }

  mutecamera = (e) => {
    const stream = this.video.srcObject
      .getTracks()
      .filter((track) => track.kind === 'video')
    this.setState((prevState) => {
      if (stream) stream[0].enabled = !prevState.camera
      return { camera: !prevState.camera }
    })
  }

  render() {
    const muteControls = this.props.showMuteControls && (
      <div>
        <i
          onClick={this.mutemic}
          style={{
            cursor: 'pointer',
            padding: 5,
            fontSize: 20,
            color: (this.state.mic && 'white') || 'red',
          }}
          className="material-icons"
        >
          {(this.state.mic && <MicIcon />) || <MicOffIcon />}
        </i>
        <i
          onClick={this.mutecamera}
          style={{
            cursor: 'pointer',
            padding: 5,
            fontSize: 20,
            color: (this.state.camera && 'white') || 'red',
          }}
          className="material-icons"
        >
          {(this.state.camera && <VideocamIcon />) || <VideocamOffIcon />}
        </i>
      </div>
    )

    return (
      <div style={{ ...this.props.frameStyle }}>
        {/* <audio id={this.props.id} muted={this.props.muted} ref={ (ref) => {this.video = ref }}></audio> */}
        <video
          id={this.props.id}
          muted={this.props.muted}
          autoPlay
          style={{ ...this.props.videoStyles }}
          // ref={ this.props.videoRef }
          ref={(ref) => {
            this.video = ref
          }}
        ></video>
        {muteControls}
      </div>
    )
  }
}

export default Video
