import React from 'react'
import { Link } from 'react-router-dom'

const Quiz = () => {
  return ( 
    <div className="content">
      <h3>You're off the hook!</h3>
      <Link to="/" className="button is-primary">Back To Lesson</Link>
    </div>
  )
}

export default Quiz