import { Link } from 'solid-app-router'

export default function About() {
  // replaced dyanmicaly
  const date = '__DATE__'

  return (
    <div>
      <div><strong>/about</strong> route, built at: { date }</div>
      <br />
      <Link href="/">
        Go Home
      </Link>
    </div>
  )
}
