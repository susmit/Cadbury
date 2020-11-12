import React, { Component } from 'react'
import Fab from '@material-ui/core/Fab'
import Video from './video'

class Videos extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rVideos: [],
      remoteStreams: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.remoteStreams !== nextProps.remoteStreams) {
      const _rVideos = nextProps.remoteStreams.map((rVideo, index) => {
        const _videoTrack = rVideo.stream
          .getTracks()
          .filter((track) => track.kind === 'video')

        const video = (_videoTrack && (
          <Video
            videoStream={rVideo.stream}
            frameStyle={{ width: 120, float: 'left', padding: '0 3px' }}
            videoStyles={{
              cursor: 'pointer',
              objectFit: 'cover',
              borderRadius: 3,
              width: '100%',
            }}
            autoplay
          />
        )) || <div></div>

        return (
          <div
            id={rVideo.name}
            onClick={() => this.props.switchVideo(rVideo)}
            style={{ display: 'inline-block' }}
            key={index}
          >
            {video}
          </div>
        )
      })

      this.setState({
        remoteStreams: nextProps.remoteStreams,
        rVideos: _rVideos,
      })
    }
  }

  render() {
    return (
      <div
        style={{
          zIndex: 3,
          position: 'fixed',
          padding: '6px 3px',
          backgroundColor: '#2e2e2e',
          maxHeight: 120,
          top: 'auto',
          right: 0,
          left: 0,
          bottom: 0,
          overflowX: 'scroll',
          whiteSpace: 'nowrap',
          borderRadius: 10,
        }}
      >
        {this.state.rVideos}
      </div>
    )
  }
}

export default Videos
