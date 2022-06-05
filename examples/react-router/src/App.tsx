import React from 'react'
import { Outlet } from 'react-router-dom'
import ReloadPrompt from './ReloadPrompt'
import './App.css'

function App() {
  // replaced dyanmicaly
  const date = '__DATE__'

  return (
    <main className="App">
      <img src="/favicon.svg" alt="PWA Logo" width="60" height="60" />
      <h1 className="Home-title">PWA React!</h1>
      <div className="Home-built">Built at: {date}</div>
      <Outlet />
      <ReloadPrompt />
    </main>
  )
}

export default App
