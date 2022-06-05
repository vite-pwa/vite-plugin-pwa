/* eslint-disable react/no-unknown-property */
import type { Component } from 'solid-js'
import { useRoutes } from 'solid-app-router'
import { routes } from './routes'
import styles from './app.module.css'
import ReloadPrompt from './ReloadPrompt'

const App: Component = () => {
  // replaced dynamically
  const date = '__DATE__'

  const Route = useRoutes(routes)

  return (
    <main class={styles.App}>
      <img src="/favicon.svg" alt="PWA Logo" width="60" height="60" />
      <h1 class={styles.Title}>PWA SolidJS!</h1>
      <div class={styles.Built}>Built at: {date}</div>
      <Route />
      <ReloadPrompt />
    </main>
  )
}

export default App
