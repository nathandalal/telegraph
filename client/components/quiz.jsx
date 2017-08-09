import React from 'react'
import { Link } from 'react-router-dom'
import MorseTree from './morse_tree.jsx'

import { getRandomWord } from '../utils/words'
import morse from '../utils/morse'

export default class Quiz extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.getInitialState()
  }

  getInitialState() {
    return {
      questionsNeededToPass: 2,
      questions: this.getTwoQuestions(true)
    }
  }

  getTwoQuestions(tiny = false) {
    return [
      {
        normalWord: getRandomWord(tiny),
        userAnswer: ""
      },
      {
        morseWord: morse.encode(getRandomWord(tiny))[0],
        userAnswer: ""
      }
    ]
  }

  render() {
    return (
      <div className="columns">
        <div className="column is-one-third">
          {this.renderQuiz()}
        </div>
        <div className="column">
          <MorseTree />
        </div>
      </div>
    )
  }

  renderQuiz() {
    return ( 
      <div className="content">
        <h3>Morse Code Practice</h3>
        {this.state.questions.map((question, index) => (
          this.renderInput({
            label: question.normalWord ? "Encode" : "Decode",
            prompt: question.normalWord ? question.normalWord : question.morseWord,
            value: question.userAnswer,
            icon: question.normalWord ? "lock" : "unlock",
            questionIndex: index
          })
        ))}
        {this.state.questions.length !== 0 && this.hasCompletedQuiz() ? (
          <div className="animated bounceInDown" style={{marginTop: "20px"}}>
            <h5>You mastered Morse Code! Nice job!</h5>
            <div className="block">
              <button className="button is-primary is-medium" 
                onClick={(() => this.setState({questions: this.state.questions.concat(this.getTwoQuestions())})).bind(this)}>
                Make More Practice
              </button>
            </div>
          </div>
          ) : ""}
      </div>
    )
  }

  renderInput(info) {
    return (
      <div className="field" key={info.questionIndex}>
        <label className="label">
          {info.label}&nbsp;
          <code>{info.prompt}</code>
          <Link className="button is-small pull-right" target="_blank" rel="noopener" to={`/${info.label.toLowerCase()}/${info.prompt}`}>Show Me</Link>
        </label>
        {info.label == "Encode" ? <small>You can hover over any letter in the tree to get its individual morse code.</small> : ""}
        <p className="control has-icons-left has-icons-right" style={{clear: "both"}}>
          <input className={`input
            ${this.isCorrectInput(info) || !(info.value) ? "" : "is-danger"}`}
            type="text" value={info.value} disabled={this.isCorrectInput(info)}
            placeholder={info.label == "Encode" ? "Only . _ and spaces allowed." : "Enter valid characters to encode."}
            onChange={((event) => {
              let currentRegex = info.label == "Encode" ? morse.validMorseRegex : morse.validWordRegex
              if(currentRegex.test(event.target.value)) {
                let stateChange = Object.assign({}, this.state)
                stateChange["questions"][info.questionIndex].userAnswer = event.target.value.toLowerCase()
                this.setState(stateChange)
              }
            }).bind(this)} />
          <span className="icon is-small is-left">
            <i className={`fa fa-${info.icon}`} />
          </span>
          <span className="icon is-small is-right">
            <i className="fa fa-check" style={{color: this.isCorrectInput(info) ? "#23d160" : ""}}/>
          </span>
        </p>
      </div>
    )
  }

  isCorrectInput(info) {
    let correctAnswers = this.state.questions.map(q => q.normalWord ? morse.encode(q.normalWord)[0] : morse.decode([q.morseWord]))
    return info.value == correctAnswers[info.questionIndex]
  }

  hasCompletedQuiz() {
    for(let i = 0; i < this.state.questions.length; i++)
      if(!this.isCorrectInput({value: this.state.questions[i].userAnswer, questionIndex: i}))
        return false
    return true
  }
}