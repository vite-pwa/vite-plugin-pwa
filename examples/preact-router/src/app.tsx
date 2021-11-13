import { Router } from 'preact-router'

import ReloadPrompt from './ReloadPrompt'
import Home from './pages/Home'
import About from './pages/About'
import Hi from './pages/hi/[name]'

import './App.css'

export function App() {
  // replaced dyanmicaly
  const date = '__DATE__'
  return (
    <>
      <main className="App">
        <img src="/favicon.svg" alt="PWA Logo" width="60" height="60" />
        <h1 className="Home-title">PWA Preact!</h1>
        <div className="Home-built">Built at: {date}</div>
        <Router>
          <Home default path="/" />
          <About path="/about" />
          <Hi path="/hi/:name" />
        </Router>
        <ReloadPrompt />
      </main>
    </>
  )
}
