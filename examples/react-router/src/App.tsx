// eslint-disable-next-line no-use-before-define
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ReloadPrompt from './ReloadPrompt'
import Home from './pages/Home'
import About from './pages/About'
import Hi from './pages/hi/[name]'
import './App.css'

function App() {
  // replaced dyanmicaly
  const date = '__DATE__'

  return (
    <main className="App">
      <img src="/favicon.svg" alt="PWA Logo" width="60" height="60" />
      <h1 className="Home-title">PWA React!</h1>
      <div className="Home-built">Built at: {date}</div>
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/about" component={About}/>
          <Route path="/hi/:name" render={props => Hi(props)}/>
        </Switch>
      </Router>
      <ReloadPrompt />
    </main>
  )
}

export default App
