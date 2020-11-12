import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import Landing from '../components/Landing'

class LandingC extends Component {
  constructor(props) {
    super(props)
    this.defaultRoomId = `${this.makeid(3)}-${this.makeid(4)}-${this.makeid(3)}`
    this.state = { roomId: this.defaultRoomId }
    this.handleChange = this.handleChange.bind(this)
  }

  makeid(length) {
    let result = ''
    const characters = 'abcdefghijklmnopqrstuvwxyz'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }

  handleChange(e) {
    this.setState({ roomId: e.target.value })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Landing
            defaultRoomId={this.defaultRoomId}
            roomId={this.state.roomId}
            handleChange={this.handleChange}
            getUserMedia={this.getUserMedia}
          />
        </header>
      </div>
    )
  }
}

LandingC.contextTypes = {
  router: PropTypes.object,
}

export default LandingC
