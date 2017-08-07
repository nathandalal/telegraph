import React from 'react'
import { Link } from 'react-router-dom'

const Footer = ({ routes, location }) => (
  <footer className="footer" style={{padding: 20}}>
    <div className="container" style={{marginBottom: 10}}>
      <div className="tabs is-centered" style={{marginBottom: 0}}>
        <ul>
        {routes.map(route => (
          <li key={route.path} className={location.pathname.split("/")[1] == route.path.substr(1) ? "is-active" : ""}>
            <Link to={route.path}>
              <span className="icon is-small"><i className={`fa fa-${route.icon}`}/></span>
              <span>{route.name}</span>
            </Link>
          </li>
        ))}
        </ul>
      </div>
      <div className="has-text-centered">
        <small>
          Made by Nathan Dalal at <i className="fa fa-envira" style={{marginTop: "8px", fontSize: "10px"}} /> MongoDB
        </small>
      </div>
    </div>
  </footer>
)

export default Footer