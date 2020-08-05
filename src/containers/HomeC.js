import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import Home from '../components/Home'

class HomeC extends Component {
  constructor(props) {
    super(props)
    this.defaultRoomId =
      this.makeid(3) + '-' + this.makeid(4) + '-' + this.makeid(3)
    this.state = { roomId: this.defaultRoomId }
    this.handleChange = this.handleChange.bind(this)
  }

  makeid(length) {
    var result = ''
    var characters = 'abcdefghijklmnopqrstuvwxyz'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
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
          <Home
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

HomeC.contextTypes = {
  router: PropTypes.object,
}

export default HomeC
