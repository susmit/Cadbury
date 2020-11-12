import React from 'react'
import './App.css'
import ReactGA from 'react-ga'
import { Route, Switch, Redirect } from 'react-router-dom'
import MeetC from './containers/MeetC'
import HomeC from './containers/HomeC'
import LandingC from './containers/LandingC'
import Landing from './components/Landing'
import NotAvailable from './components/NotAvailable'

function App() {
  return (
    <Switch>
      <Route exact path="/home" component={HomeC} />
      <Route exact path="/land" component={LandingC} />
      <Route exact path="/" component={MeetC}>
        {' '}
        <Redirect to="/land" />{' '}
      </Route>
      {/* <Route path="/" component={() => { 
     window.location.href = 'https://huddle01.com/'; 
     return null;
}}/> */}
      <Route exact path="/:room" component={MeetC} />
      <Route path="*" component={NotAvailable} />
    </Switch>
  )
}

export default App
