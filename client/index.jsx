import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom'

import Lesson from './components/lesson.jsx'
import Encoding from './components/encoding.jsx'
import Decoding from './components/decoding.jsx'
import Quiz from './components/quiz.jsx'

import Footer from './components/footer.jsx'

class Index extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let main_routes = [
      { path: "/",              name: "Lesson",           icon: "graduation-cap",   component: Lesson },
      { path: "/encode",        name: "Encoding",         icon: "lock",             component: Encoding },
      { path: "/decode",        name: "Decoding",         icon: "unlock",           component: Decoding },
      { path: "/quiz",          name: "Quiz",             icon: "pencil",           component: Quiz },
    ]

    let routes = main_routes.concat([
      { path: "/encode/:text",        component: Encoding},
      { path: "/decode/:text",        component: Decoding},
    ])

    return (
      <Router>
        <div style={{display: "flex", minHeight: "100vh", flexDirection: "column"}}>
          <div id="main-content" style={{flex: 1, padding: "5%"}}>
            <Switch>
              {routes.map(route => <Route exact path={route.path} component={route.component} key={route.path} />)}
              <Redirect to ="/"/>
            </Switch>
          </div>
          <Route component={(props) => <Footer routes={main_routes} {...props}/>}/>
        </div>
      </Router>
    )
  }
}

render(<Index />, document.getElementById('app'))