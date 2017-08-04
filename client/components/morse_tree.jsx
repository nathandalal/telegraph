import React from 'react'
import PropTypes from 'prop-types'
import LineTo from 'react-lineto'
import morse from '../utils/morse'

export default class MorseTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = { screenWidth: window.innerWidth, activeMorseText: "._" }
    this.updateDimensions = this.updateDimensions.bind(this)
  }

  updateDimensions() {
    this.setState({screenWidth: window.innerWidth})
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this))
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this))
  }

  render() {
    let { activeMorseText, screenWidth } = this.state

    let possibleNodes = morse.decodePrefix(activeMorseText)
    if(!activeMorseText) possibleNodes.push("Start")

    return (
      <div className="container has-text-centered">
        {this.renderNode("Start", ["e", "t"], activeMorseText == "" ? "" : "neutral", activeMorseText == "", screenWidth > 768 ? "large" : "medium")}
        {Array(5).fill(0).map((n, i) => (
          <div className="block" key={i}>
            <div style={{height: 50}}/>
            {morse.tree.filter(node => node.level == i + 1).map(node => (
              this.renderNode(
                node.text,
                node.children, 
                possibleNodes.find(s => s == (node.text.length == 4 ? node.text.charAt(0) : node.text)) ? node.type : "neutral",
                activeMorseText == node.text)
            ))}
          </div>
        ))}
      </div>
    )
  }

  renderNode(text, children = [], type = "neutral", isActive = false, size = this.state.screenWidth > 768 ? "medium" : "small") {
    return (
      <span style={{margin: "0.5%"}} key={text}>
        <span className={`is-character-${text}`}>
          <span className={`tag is-${size} 
            is-${text.length == 4 ? "light" : (isActive ? "primary" : (type == "_" ? "danger" : (type == "." ? "info" : "light")))}`}>
            {text.length == 4 ? text.charAt(2) : text.toUpperCase()}
          </span>
          {children.map((child, i) => (
            <LineTo key={i} className="inline-block"
              from={`is-character-${text}`} to={`is-character-${child}`}
              fromAnchor="bottom center" toAnchor="top center"
              border={`2px solid ${(type == "neutral") ? "hsl(0, 0%, 71%)" : (i == 0 ? "hsl(217, 71%, 53%)" : "hsl(348, 100%, 61%)")}`} zIndex={-1}/>
          ))}
        </span>
      </span>
    )
  }
}