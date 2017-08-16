import React from 'react'
import { Link } from 'react-router-dom'
import CopyToClipboard from 'react-copy-to-clipboard'
import Slider from 'react-rangeslider'

import MorseTree from './morse_tree.jsx'
import morse from '../utils/morse'

export default class Decoding extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
    this.timeouts = []
  }

  getInitialState(text = (this.props.match.params.text || ""), delayms = 1500) {
    return {
      text: text,
      currentMorseCharacter: "",
      currentMorseState: "",
      answer: "",
      delayms: delayms,
      currentIndex: -1,
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
    this.props.history.push(`/decode/${this.state.text}`)
    this.setState(this.getInitialState(this.state.text, this.state.delayms))

    let currentMorseText = this.state.text
    let characters = currentMorseText.split(" ")
    let answer = morse.decode([currentMorseText])

    let delayms = this.state.delayms == 0 ? 100 : this.state.delayms
    let ms = -delayms

    characters.forEach((charText, answerIndex) => {
      this.updateCurrentMorseCharacter(charText, answerIndex, ms = ms + delayms)
      charText.split("").forEach((char, charTextIndex) => {
        this.updateCurrentMorseState(charText.substr(0, charTextIndex + 1), ms = ms + delayms)
      })
      this.updateCurrentAnswer(answer.substr(0, answerIndex + 1), ms = ms + delayms)
    })

    this.markDone(ms = ms + delayms)
  }
  
  updateCurrentMorseCharacter(charText, answerIndex, delayms) {
    this.timeouts.push(setTimeout((() => {
      this.setState({currentIndex: answerIndex, currentMorseCharacter: charText, currentMorseState: ""})
    }).bind(this), delayms))
  }

  updateCurrentMorseState(charSoFar, delayms) {
    this.timeouts.push(setTimeout((() => {
      this.setState({currentMorseState: charSoFar})
    }).bind(this), delayms))
  }

  updateCurrentAnswer(answerSoFar, delayms) {
    this.timeouts.push(setTimeout((() => {
      this.setState({answer: answerSoFar})
    }).bind(this), delayms))
  }

  markDone(delayms) {
    this.timeouts.push(setTimeout((() => {
      this.setState({currentIndex: -1, currentMorseState: "", currentMorseCharacter: ""})
    }).bind(this), delayms))
  }

  render() {
    return (
      <div className="content">
        <div className="columns container">
          <div className="column is-one-thirds">
            {this.renderInput()}
            {this.renderTopButtons()}
            {this.renderAnimation()}
            {this.renderExplanation()}
          </div>
          <div className="column is-two-thirds">
            <MorseTree currentCode={this.state.currentMorseState}/>
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
            <input className="input" type="text" placeholder="Only . _ and spaces allowed." value={this.state.text}
              onChange={(({target}) => morse.validMorseRegex.test(target.value) ? this.setState({text: target.value}) : null).bind(this)}
              onKeyPress={(({key}) => key == "Enter" ? this.startAnimation() : null).bind(this)}
              style={{letterSpacing: 2}}/>
          </p>
          <p className="control">
            <a className="button is-primary" onClick={this.startAnimation.bind(this)}>
              Decode
            </a>
          </p>
        </div>
      </div>
    )
  }

  renderTopButtons() {
    return (
      <div className="block pull-right">
        {this.props.match.params.text ? <CopyToClipboard text={morse.decode([this.props.match.params.text])}>
          <button className="button is-small is-info is-outlined">Copy Decoded Answer</button>
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
          {this.state.currentIndex == -1 && !text ? "Animation unstarted. Enter some morse code!" : ""}
          {text ? 
          <div>
            {this.state.currentIndex == -1 ? 
              <span className="tag is-primary pull-right"><span className="icon is-small"><i className="fa fa-check"/></span><span>Done</span></span> :
              <span className="tag is-info pull-right">Translating:&nbsp;<tt>{text.split(" ")[this.state.currentIndex].split("").join(" ")}</tt></span>}
            <div style={{clear: "both", paddingTop: 10}}>
              <h5>Morse Text: <code className="animated bounce" style={{letterSpacing: 2}}>{text}</code></h5>
              {this.state.currentIndex !== -1 ? <h5>Current Morse Character: <code className="animated bounce">{text.split(" ")[this.state.currentIndex]}</code></h5> : ""}
              {this.state.answer ? (
                <h5>
                  Decoded Text:&nbsp;
                  <code className="animated bounce">{this.state.answer}</code>
                  {this.state.currentIndex == -1 ? 
                    <Link className="button is-info is-small pull-right" to={`/encode/${this.state.answer}`}>
                      Encode {'"'}{this.state.answer}{'"'}
                    </Link>
                  : ""}
                </h5>
              ) : ""}
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
          Decode {`"${this.state.text}"`}
        </a>
        <hr/>
      </div>
    )
  }

  renderExplanation() {
    return (
      <div className="content">
        <h6>
          Decoding characters was done by hand, with people as decoders reading these trees to know how to decode morse.
          With every "dit", they moved left, and with every "dah", they moved right.
        </h6>
        <h6>
          In modern times, computers store a tree like this using a data structure called a <code>binary tree</code>.
        </h6>
        <h6>
          Every node in a binary tree has a maximum of two children, one on the left and one on the right.
          Here is a Python code segment that shows how you would use a binary tree to decode morse!
        </h6>
        <pre><span style={{color: '#800000', fontWeight: 'bold'}}>def</span> decode<span style={{color: '#808030'}}>(</span>character<span style={{color: '#808030'}}>,</span> morseTree<span style={{color: '#808030'}}>)</span><span style={{color: '#808030'}}>:</span>{"\n"}{"    "}currentNode <span style={{color: '#808030'}}>=</span> morseTree{"\n"}{"\n"}{"    "}<span style={{color: '#800000', fontWeight: 'bold'}}>for</span> character <span style={{color: '#800000', fontWeight: 'bold'}}>in</span> characters<span style={{color: '#808030'}}>:</span>{"\n"}{"        "}<span style={{color: '#800000', fontWeight: 'bold'}}>if</span> character <span style={{color: '#44aadd'}}>==</span> <span style={{color: '#0000e6'}}>"."</span><span style={{color: '#808030'}}>:</span>{"\n"}{"            "}currentNode <span style={{color: '#808030'}}>=</span> currentNode<span style={{color: '#808030'}}>.</span>left{"\n"}{"        "}<span style={{color: '#800000', fontWeight: 'bold'}}>if</span> character <span style={{color: '#44aadd'}}>==</span> <span style={{color: '#0000e6'}}>"-"</span><span style={{color: '#808030'}}>:</span>{"\n"}{"            "}currentNode <span style={{color: '#808030'}}>=</span> currentNode<span style={{color: '#808030'}}>.</span>right{"\n"}{"\n"}{"    "}<span style={{color: '#800000', fontWeight: 'bold'}}>return</span> currentNode<span style={{color: '#808030'}}>.</span>value{"\n"}</pre>
        <h6>
          Binary trees are used widely today for <b>data storage and compression</b>.
          If you would like a better explanation of a binary tree, click the link below.
        </h6>
        <a className="button is-info" href="https://www.cs.cmu.edu/~adamchik/15-121/lectures/Trees/trees.html">
          Explanation
        </a>
      </div>
    )
  }
}