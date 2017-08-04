import React from 'react'

const Home = () => {
  let structure = [
    {name: "app.js",
      description: "The index file run to start the Express server."},
    {name: "config.js",
      description: "The file that runs and loads environmental variables in a deployed setting or in a '.env' file."},
    {name: "/api", 
      description: "A folder containing a basic Express Router API. \
                    The API can be documented from the file and all routes \
                    are visible at the '/api' endpoint."},
    {name: "/client", 
      description: "A folder containing all the React code. \
                    Contains an implementation of a basic React Router object \
                    with components for routes."},
    {name: "/public", 
      description: "A folder containing all public CSS and JS files. \
                    Contains a copy of Bulma for basic styling \
                    with custom files for any custom CSS and JS needs. \
                    The bundle.js file generated by Webpack also goes here, \
                    so all the compiled React code will live here as well."},
    {name: "/test",
      description: "A folder for tests, if you need them. A file lives in there for testing purposes, \
                    and 'npm run test' will run the test file."},
    {name: "/views",
      description: "The views rendered by Express, with the React and the API Nunjucks (HTML view engine) files."},
    {name: "webpack.config.js, .babelrc, package.json",
      description: "The required files and configuration to run Webpack, Babel (React ES6 Compiler), and npm respectively."},
    {name: ".eslintrc.json",
      description: "The configuration file for a linter that checks React styling. Check your style with 'npm run lint'."}
  ]

  return ( 
    <div className="content">
      <h3>Welcome to a simple React template!</h3>
      <h4>The structure of this template is shown below.</h4>
      <ul>{structure.map(path => (
        <li key={path.name}>
          <code>{path.name}</code> 
          <h6>{path.description}</h6>
        </li>
      ))}</ul>
    </div>
  )
}

export default Home