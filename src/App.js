import React from 'react'
import './App.css'
// import Hls from 'hls.js'
import { Route, Switch, Redirect } from 'react-router-dom'
import MeetC from './containers/MeetC'
import HomeC from './containers/HomeC'
import Landing from './components/Landing'
import NotAvailable from './components/NotAvailable'

function App() {
  return (
    <Switch>
      <Route exact path="/home" component={HomeC} />
      <Route exact path="/land" component={Landing} />
      <Route exact path="/" component={MeetC}>
        {' '}
        <Redirect to="/land" />{' '}
      </Route>
      <Route exact path="/:room" component={MeetC} />
      <Route path="*" component={NotAvailable} />
    </Switch>
  )
}

export default App
