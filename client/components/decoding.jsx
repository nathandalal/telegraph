import React from 'react'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom'
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

	getInitialState() {
		return {
			text: this.props.match.params.text || "",
			currentMorseCharacter: "",
			currentMorseState: "",
			answer: "",
			delayms: 1000,
			currentIndex: -1,
			showControls: false
		}
	}

	componentDidMount() {
		this.clearTimeouts()
		this.timeouts = []
		console.log(this.state.text)
		if(this.state.text)
			this.startAnimation()
	}

  componentWillUnmount() {
    this.clearTimeouts()
  }

  clearTimeouts() {
    this.timeouts.forEach(clearTimeout)
  }

	startAnimation() {
		this.props.history.push(`/decode/${this.state.text}`)
		this.setState(this.getInitialState())
		let currentMorseText = this.props.match.params.text
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
      this.setState({currentIndex: -1})
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
				    	onChange={(({target}) => /^[.\s_]*$/.test(target.value) ? this.setState({text: target.value}) : null).bind(this)}
				    	onKeyPress={(({key}) => key == "Enter" ? this.startAnimation() : null).bind(this)}/>
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
          <button className="button is-small">Copy Decoded Answer</button>
        </CopyToClipboard> : ""}
        <button className="button is-small" 
          onClick={(() => this.setState({showControls: !this.state.showControls})).bind(this)}>
          {this.state.showControls ? "Hide" : "Show"} Controls
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
					{this.state.currentIndex !== -1 && !text ? "Animation unstarted." : ""}
					{text ? 
					<div>
						{this.state.currentIndex == -1 ? 
							<span className="tag is-primary pull-right">Done</span> :
							<span className="tag is-info pull-right">Translating <tt>{text.split(" ")[this.state.currentIndex]}</tt></span>}
						<h5 style={{clear: "both"}}>Morse Text: <code className="animated bounce">{text}</code></h5>
						<h5>Decoded Text: <code className="animated bounce">{this.state.answer || "in progress..."}</code></h5>
					</div> : ""}
				</div>
			</div>
		)
	}

	renderControls() {
		return (
      <div>
        <h6>
          Animation Delay (Seconds)<br/>
          <small>Changes take effect on restart.</small>
        </h6>
        <Slider min={0} max={5} step={0.5} value={this.state.delayms * 1.0 / 1000}
          onChange={((val) => this.setState({delayms: val * 1000})).bind(this)} />
        <hr/>
      </div>
    )
  }
}