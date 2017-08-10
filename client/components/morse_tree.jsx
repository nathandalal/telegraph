import React from 'react'
import LineTo from 'react-lineto'
import morse from '../utils/morse'

export default class MorseTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = { screenWidth: window.innerWidth }
    this.updateDimensions = this.updateDimensions.bind(this)
    this.ENLARGING_BREAKPOINT = 1600
  }

  updateDimensions() {
    this.setState({screenWidth: window.innerWidth})
  }
  componentDidMount() {
    this.forceUpdate()
    window.addEventListener("resize", this.updateDimensions.bind(this))
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this))
  }

  render() {
    let { screenWidth } = this.state
    let { currentCode } = this.props

    let possibleNodes = morse.decodePrefix(currentCode)
    if(!currentCode) possibleNodes.push("Start")

    return (
      <div className="has-text-centered">
        {this.renderHeading()}
        {this.renderNode("Start", ["e", "t"], currentCode == "" ? "" : "neutral", currentCode == "", screenWidth > this.ENLARGING_BREAKPOINT ? "large" : "medium")}

        {Array(5).fill(0).map((n, i) => (
          <div className="block" key={i}>
            <div style={{height: 50}}/>
            {morse.tree.filter(node => node.level == i + 1).map(node => (
              this.renderNode(
                node.text,
                node.children, 
                currentCode ? (currentCode.startsWith(morse.encode(node.text)[0]) ? node.type : "neutral") : node.type,
                currentCode === morse.encode(node.text)[0])
            ))}
          </div>
        ))}
      </div>
    )
  }

  renderHeading() {
    let { currentCode } = this.props

    return (
      <div className="content">
        <h3 className="title">Morse Code Tree</h3>
        <h6 className="subtitle">
          Follow <code className="has-text-info">. . .</code> on dots, and <code className="has-text-danger">_ _ _</code> on dashes.
        </h6>
        <h6>
          Current Morse State:&nbsp;
          <code>
            {currentCode ? `${currentCode} (${morse.decode([currentCode])[0].toUpperCase()})` : "Initial"}
          </code>
        </h6>
      </div>
    )
  }

  renderNode(text, children = [], type = "neutral", isActive = false, size = this.state.screenWidth > this.ENLARGING_BREAKPOINT ? "medium" : "small") {
    return (
      <span style={{margin: "0.5%"}} key={text}>
        <span className={`is-character-${text}`}>
          <span className={`tag is-${size} tooltip 
            is-${text.length == 4 ? "light" : (type == "_" ? "danger" : (type == "." ? "info" : "light"))} ${isActive ? "animated jello" : ""}`}
            data-tooltip={`${text.length == 1 ? morse.encode(text)[0].split("").join(" ") : "Not a morse character."}`}
            style={{border: isActive ? "2px solid #303030" : "1px solid gray"}}>
            {text.length == 4 ? text.charAt(2) : text.toUpperCase()}
          </span>
          {children.map((child, i) => (
            <LineTo key={i} className="inline-block"
              from={`is-character-${text}`} to={`is-character-${child}`}
              fromAnchor="bottom center" toAnchor="top center"
              border={`2px ${(i == 0 ? `dotted hsl(217, ${type == "neutral" ? "20%" : "71%"}, 53%)` : `dashed hsl(348, ${type == "neutral" ? "30%" : "100%"}, 61%)`)}`} zIndex={-1}/>
          ))}
        </span>
      </span>
    )
  }
}