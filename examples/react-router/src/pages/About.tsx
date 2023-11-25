import React from 'react'

function About() {
  // replaced dyanmicaly
  const date = '__DATE__'
  return (
    <div className="About">
      <div>
        <strong>/about</strong>
        {' '}
        route, built at:
        {' '}
        { date }
      </div>
      <br />
      <a href="/">Go Home</a>
    </div>
  )
}

export default About
