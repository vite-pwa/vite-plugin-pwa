/* eslint-disable react/react-in-jsx-scope,react/no-unknown-property */
import { Component, createSignal } from 'solid-js'
import ReloadPrompt from './ReloadPrompt'
import styles from './App.module.css'

const App: Component = () => {
  // replaced dyanmicaly
  const date = '__DATE__'

  const [count, setCount] = createSignal(0)
  return (
    <main class={styles.App}>
      <img src="/favicon.svg" alt="PWA Logo" width="60" height="60" />
      <h1 class={styles.Title}>PWA SolidJS!</h1>
      <div class={styles.Built}>Built at: {date}</div>
      <p>
        <button type="button" onClick={() => setCount(count() + 1)}>
          count is: {count}
        </button>
      </p>
      <ReloadPrompt />
    </main>
  )
}

export default App
