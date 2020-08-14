import { combineReducers } from 'redux'

import roomReducer from './room-reducer'
import audioReducer from './audio-reducer'
import videoReducer from './video-reducer'

const reducers = combineReducers({
  rooms: roomReducer,
  video: videoReducer,
  audio: audioReducer,
})
export default reducers
