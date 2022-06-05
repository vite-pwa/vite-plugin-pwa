/* eslint-disable react/no-unknown-property */
import { createSignal } from 'solid-js'
import { useNavigate } from 'solid-app-router'
import styles from './home.module.css'

export default function Home() {
  const navigate = useNavigate()
  const [count, setCount] = createSignal(0)
  const [name, setName] = createSignal('')

  const handleChange = (event) => {
    setName(event.target.value || '')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const submit = name()
    if (submit && submit.trim().length > 0)
      navigate(`/hi/${submit}`)
  }

  return (
    <div class={styles.Home}>
      <p>
        <button type="button" onClick={() => setCount(count() + 1)}>
          count is: {count}
        </button>
      </p>
      <br />
      <form onSubmit={handleSubmit}>
        <input value={name()} onChange={handleChange} type="text" aria-label="What's your name?" placeholder="What's your name?" />
        <button type="submit">GO</button>
      </form>
      <br/>
      <a href="/about">About</a>
      <br/>
    </div>
  )
}
