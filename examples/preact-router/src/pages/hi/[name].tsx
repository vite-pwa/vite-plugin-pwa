import type { RouteProps } from 'preact-router'

function Hi(props: RouteProps<{ name: string }>) {
  // replaced dyanmicaly
  const date = '__DATE__'
  return (
    <div>
      <div><strong>/hi</strong> route, built at: { date }</div>
      <p>Hi: { props.name }</p>
      <br />
      <a href="/">Go Home</a>
    </div>
  )
}

export default Hi
