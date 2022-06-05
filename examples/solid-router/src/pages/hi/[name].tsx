import { Link, useRouteData } from 'solid-app-router'

export default function Hi() {
  // replaced dyanmicaly
  const date = '__DATE__'
  const data: { name: string } = useRouteData()

  return (
    <div>
      <div><strong>/hi</strong> route, built at: { date }</div>
      <p>Hi: { data.name }</p>
      <br />
      <Link href="/">
        Go Home
      </Link>
    </div>
  )
}
