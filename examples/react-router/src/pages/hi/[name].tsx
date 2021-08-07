// eslint-disable-next-line no-use-before-define
import React from 'react'
import { RouteComponentProps } from 'react-router'

function Hi(props: RouteComponentProps<{ name: string }>) {
  // replaced dyanmicaly
  const date = '__DATE__'
  return (
    <div>
      <div><strong>/hi</strong> route, built at: { date }</div>
      <p>Hi: { props.match.params.name }</p>
      <br />
      <a href="/">Go Home</a>
    </div>
  )
}

export default Hi
