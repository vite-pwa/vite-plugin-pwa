import React from 'react'
import { useParams } from 'react-router'

function Hi() {
  // replaced dyanmicaly
  const date = '__DATE__'
  const params = useParams()
  return (
    <div>
      <div><strong>/hi</strong> route, built at: { date }</div>
      <p>Hi: { params.name }</p>
      <br />
      <a href="/">Go Home</a>
    </div>
  )
}

export default Hi
