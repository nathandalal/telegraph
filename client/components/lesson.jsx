import React from 'react'
import { Link } from 'react-router-dom'
import morse from '../utils/morse'

export default class Lesson extends React.Component {
  constructor(props) {
    super(props)
    this.state = {text: ""}
  }

  render() {
    return ( 
      <div className="content">
        <h1>Morse Code: An Innovation of Communication</h1>
        <hr/>
        <h3>What is the electrical telegraph?</h3>
        <ul>
          <li>The electrical telegraph was the first long distance electrical communication device.</li>
          <li>Before the telegraph, people communicated using boats, horses, and smoke signals,
          which all required people to be right next to each other.</li>
          <li>The telegraph allowed states and nations far away from each other to communicate.</li>
        </ul>
        <h3>How did it work?</h3>
        <ul>
          <li>The telegraph sends messages using electrical signals.</li>
          <li>Samuel F.B. Morse, the creator of the telegraph, sent the first telegraph message from Washington D.C. to Baltimore in 1844.</li>
          <li>He invented a method of translating sounds to words called Morse Code.</li>
        </ul>
        <h3>What did messages look like?</h3>
        <ul>
          <li>Telegraphs sent dits (denoted by <b>.</b>) or dahs (denoted by <b>_</b>), which were different sounds and were different in length.</li>
          <li>Morse code converts letters typed on a typewriter into these sounds.</li>
          <li>Codes sent electronically or sent by paper fax later in history required people to translate the dits and dahs to English words.</li>
        </ul>
        <h3>Let{"'"}s try out morse code.</h3>
        <div className="columns">
          <div className="field has-addons column is-6">
            <div className="control is-expanded">
              <input className="input" type="text" placeholder="Type your message here."
                value={this.state.text}
                onChange={(({target}) => this.setState({text: morse.makeValidMorse(target.value)}) : null).bind(this)}
                onKeyPress={(({key}) => key == "Enter" ? this.props.history.push(`/encode/${this.state.text}`) : null).bind(this)}/>
            </div>
            <div className="control">
              <Link className="button is-primary" to={`/encode/${this.state.text}`}>
                Encode Your Message
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}