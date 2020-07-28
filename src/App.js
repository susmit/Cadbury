import React from 'react'
import './App.css'
// import Hls from 'hls.js'
import { Route, Switch } from 'react-router-dom'
import Meet from './components/Meet'
import Home from './components/Home'
import Landing from './components/Landing'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-intro">
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/meet" component={Meet} />
            <Route path="/" component={Landing} />
          </Switch>
        </div>
      </header>
    </div>
  )
}

// class VideoPlayer extends React.Component {
//   state = {}
//   componentDidUpdate() {
//     const video = this.player
//     const hls = new Hls()
//     const url =
//       'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'

//     hls.loadSource(url)
//     hls.attachMedia(video)
//     hls.on(Hls.Events.MANIFEST_PARSED, function () {
//       video.play()
//     })
//   }
//   render() {
//     return (
//       <video
//         className="videoCanvas"
//         ref={(player) => (this.player = player)}
//         autoPlay={true}
//       />
//     )
//   }
// }

export default App
