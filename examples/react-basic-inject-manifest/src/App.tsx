// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react'
import ReloadPrompt from './ReloadPrompt'
import './App.css'

function App() {
  // replaced dyanmicaly
  const date = '__DATE__'

  const [count, setCount] = useState(0)

  return (
    <main className="App"><img src="/favicon.svg" alt="PWA Logo" width="60" height="60" />
      <h1 className="App-title">PWA React!</h1>
      <div className="App-built">Built at: {date}</div>
      <p>
        <button type="button" onClick={() => setCount(count => count + 1)}>
            count is: {count}
        </button>
      </p>
      <ReloadPrompt />
    </main>
  )
}

export default App
