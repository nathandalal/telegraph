import React from 'react'
import { Link } from 'react-router-dom'
import CopyToClipboard from 'react-copy-to-clipboard'
import Slider from 'react-rangeslider'

import MorseTree from './morse_tree.jsx'
import morse from '../utils/morse'

export default class Encoding extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
    this.timeouts = []
  }

  getInitialState(text = (this.props.match.params.text || ""), delayms = 1500) {
    return {
      text: text,
      answer: [],
      delayms: delayms,
      currentIndex: -1,
      morseChar: "",
      showControls: false
    }
  }

  componentDidMount() {
    this.clearTimeouts()
    if(this.state.text)
      this.startAnimation()
  }

  componentWillUnmount() {
    this.clearTimeouts()
  }

  clearTimeouts() {
    this.timeouts.forEach(clearTimeout)
    this.timeouts = []
  }

  startAnimation() {
    this.clearTimeouts()
    this.props.history.push(`/encode/${this.state.text}`)
    this.setState(this.getInitialState(this.state.text, this.state.delayms))

    let currentText = this.state.text
    let answer = morse.encode(currentText)

    let delayms = this.state.delayms == 0 ? 100 : this.state.delayms
    let ms = -delayms

    answer.forEach((morseString, currentIndex) => {
      morseString.split(" ").forEach(morseChar => {
        this.updateCurrentAnswer(morseChar, currentIndex, ms = ms + delayms)
      })
    })
    this.updateCurrentAnswer("FINISH", -1, ms = ms + delayms)
  }

  updateCurrentAnswer(morseChar, currentIndex, delayms) {
    this.timeouts.push(setTimeout((() => {
      if(currentIndex != -1) {
        let answer = this.state.answer
        answer[currentIndex] = answer[currentIndex] ? `${answer[currentIndex]} ${morseChar}` : morseChar
        this.setState({answer, currentIndex, morseChar})
      } else this.setState({currentIndex, morseChar: ""})
    }).bind(this), delayms))
  }

  render() {
    return (
      <div className="content">
        <div className="columns is-tablet container">
          <div className="column is-one-thirds">
            {this.renderInput()}
            {this.renderTopButtons()}
            {this.renderAnimation()}
          </div>
          <div className="column is-two-thirds">
            <MorseTree currentCode={this.state.morseChar}/>
          </div>
        </div>
      </div>
    )
  }

  renderInput() {
    return (
      <div>
        <div className="field has-addons">
          <p className="control is-expanded">
            <input className="input" type="text" placeholder="Enter valid characters to encode." value={this.state.text}
              onChange={(({target}) => morse.validWordRegex.test(target.value) ? this.setState({text: target.value.toLowerCase()}) : null).bind(this)}
              onKeyPress={(({key}) => key == "Enter" ? this.startAnimation() : null).bind(this)}
              style={{fontFamily: "Consolas,Monaco,Lucida Console,monospace"}}/>
          </p>
          <p className="control">
            <a className="button is-primary" onClick={this.startAnimation.bind(this)}>
              Encode
            </a>
          </p>
        </div>
      </div>
    )
  }

  renderTopButtons() {
    return (
      <div className="block pull-right">
        {this.props.match.params.text ? <CopyToClipboard text={morse.encode(this.props.match.params.text).join("\n")}>
          <button className="button is-small is-info is-outlined">Copy Encoded Words</button>
        </CopyToClipboard> : ""}
        <button className="button is-small is-outlined" 
          onClick={(() => this.setState({showControls: !this.state.showControls})).bind(this)}>
          {this.state.showControls ? "Hide Controls" : "Change Speed"}
        </button>
      </div>
    )
  }

  renderAnimation() {
    let text = this.props.match.params.text

    return (
      <div className="box content">
        <div style={{clear: "both"}}>
          {this.state.showControls ? this.renderControls() : ""}
          {this.state.answer.length == 0 ? "Animation unstarted. Enter some morse code!" : ""}
          {text ? 
          <div>
            {this.state.currentIndex == -1 && this.state.answer ? 
              <span className="tag is-primary pull-right"><span className="icon is-small"><i className="fa fa-check"/></span><span>Done</span></span> :
              <span className="tag is-info pull-right">Translating:&nbsp;<tt>{text.split(" ")[this.state.currentIndex]}</tt></span>}
            <div style={{clear: "both", paddingTop: 10}}>
              <h5>Input Text: <code className="animated bounce">{text}</code></h5>
              <h5>Words In Morse Code:</h5>
              <ul style={{listStyleType: "none", overflow: "wrap"}}>
                {this.state.answer.map((word, index) => (
                  <li key={index}>
                    <h6>Word {index + 1}: ({text.split(' ')[index]})</h6>
                    <div className="columns is-mobile">
                      <div className="column is-7">
                        <h6><code className="animated bounce">{word}</code></h6>
                      </div>
                      <div className="column is-5">
                        {index < this.state.currentIndex || this.state.currentIndex == -1 ? 
                          <Link className="button is-info is-small" to={`/decode/${word}`}>Decode Word {index + 1}</Link>
                        : ""}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div> : ""}
        </div>
      </div>
    )
  }

  renderControls() {
    return (
      <div className="has-text-centered">
        <h6>
          Animation Delay (Seconds)<br/>
          <small>Changes take effect on restart.</small>
        </h6>
        <Slider min={0} max={5} step={0.5} value={this.state.delayms * 1.0 / 1000}
          onChange={((val) => this.setState({delayms: val * 1000})).bind(this)} />
        <a className="button is-primary is-outlined" onClick={this.startAnimation.bind(this)}>
          Encode {`"${this.state.text}"`}
        </a>
        <hr/>
      </div>
    )
  }
}