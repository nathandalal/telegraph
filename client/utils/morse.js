const trie = require('trie-prefix-tree')

let encoderMap = {}
encoderMap["a"]="._"
encoderMap["b"]="_..."
encoderMap["c"]="_._."
encoderMap["d"]="_.."
encoderMap["e"]="."
encoderMap["f"]=".._."
encoderMap["g"]="__."
encoderMap["h"]="...."
encoderMap["i"]=".."
encoderMap["j"]=".___"
encoderMap["k"]="_._"
encoderMap["l"]="._.."
encoderMap["m"]="__"
encoderMap["n"]="_."
encoderMap["o"]="___"
encoderMap["p"]=".__."
encoderMap["q"]="__._"
encoderMap["r"]="._."
encoderMap["s"]="..."
encoderMap["t"]="_"
encoderMap["u"]=".._"
encoderMap["v"]="..._"
encoderMap["w"]=".__"
encoderMap["x"]="_.._"
encoderMap["y"]="_.__"
encoderMap["z"]="__.."
encoderMap["1"]=".____"
encoderMap["2"]="..___"
encoderMap["3"]="...__"
encoderMap["4"]="...._"
encoderMap["5"]="....."
encoderMap["6"]="_...."
encoderMap["7"]="__..."
encoderMap["8"]="___.."
encoderMap["9"]="____."
encoderMap["0"]="_____"
encoderMap["+"]="._._."
encoderMap["="]="_..._"
encoderMap["/"]="_.._."
encoderMap[" "]=" "

let decoderMap = {}
decoderMap["._"]="a"
decoderMap["_..."]="b"
decoderMap["_._."]="c"
decoderMap["_.."]="d"
decoderMap["."]="e"
decoderMap[".._."]="f"
decoderMap["__."]="g"
decoderMap["...."]="h"
decoderMap[".."]="i"
decoderMap[".___"]="j"
decoderMap["_._"]="k"
decoderMap["._.."]="l"
decoderMap["__"]="m"
decoderMap["_."]="n"
decoderMap["___"]="o"
decoderMap[".__."]="p"
decoderMap["__._"]="q"
decoderMap["._."]="r"
decoderMap["..."]="s"
decoderMap["_"]="t"
decoderMap[".._"]="u"
decoderMap["..._"]="v"
decoderMap[".__"]="w"
decoderMap["_.._"]="x"
decoderMap["_.__"]="y"
decoderMap["__.."]="z"
decoderMap[".____"]="1"
decoderMap["..___"]="2"
decoderMap["...__"]="3"
decoderMap["...._"]="4"
decoderMap["....."]="5"
decoderMap["_...."]="6"
decoderMap["__..."]="7"
decoderMap["___.."]="8"
decoderMap["____."]="9"
decoderMap["_____"]="0"
decoderMap["_..._"]="="
decoderMap["._._."]="+"
decoderMap["_.._."]="/"
decoderMap[" "]=" "


// encode takes a human string, returns a list of morse words, each letter separated by a space
let encode = (str) => str.split(" ").map(s => s.split("").map(c => encoderMap[c]).join(" "))

// decode takes a list of morse words, each letter separated by a space, returns a human string
let decode = (list) => list.map(s => s.split(" ").map(c => decoderMap[c]).join("")).join(" ")

let morseStrings = Object.keys(decoderMap)
let morseTrie = trie(morseStrings)
let decodePrefix = (letter) => letter ? morseTrie.getPrefix(letter).map(c => decoderMap[c]) : morseStrings.map(c => decoderMap[c])

// let morseStringToTreeEntry = (morse) => {
//   let answer = {}
//   answer.text = decoderMap[morse]
//   answer.level = morse.length
//   answer.children = [decoderMap[morse + "."], decoderMap[morse + "_"]]
//   return answer
// }
// let tree = Object.keys(decoderMap).map(morseStringToTreeEntry)
// tree = tree.filter(node => node.text != " ")
let tree = [
  { text: 'e', level: 1, children: [ 'i', 'a' ], type: '.' },
  { text: 't', level: 1, children: [ 'n', 'm' ], type: '_' },

  { text: 'i', level: 2, children: [ 's', 'u' ], type: '.' },
  { text: 'a', level: 2, children: [ 'r', 'w' ], type: '_' },
  { text: 'n', level: 2, children: [ 'd', 'k' ], type: '.' },
  { text: 'm', level: 2, children: [ 'g', 'o' ], type: '_' },

  { text: 's', level: 3, children: [ 'h', 'v' ], type: '.' },
  { text: 'u', level: 3, children: [ 'f', 'u__2' ], type: '_' },
  { text: 'r', level: 3, children: [ 'l', 'r_.+' ], type: '.' },
  { text: 'w', level: 3, children: [ 'p', 'j' ], type: '_' },
  { text: 'd', level: 3, children: [ 'b', 'x' ], type: '.' },
  { text: 'k', level: 3, children: [ 'c', 'y' ], type: '_' },
  { text: 'g', level: 3, children: [ 'z', 'q' ], type: '.' },
  { text: 'o', level: 3, children: [ 'o..2', 'o***' ], type: '_' },

  { text: 'h',      level: 4, children: [ '5', '4' ], type: '.' },
  { text: 'v',      level: 4, children: [ undefined, '3' ], type: '_' },
  { text: 'f',      level: 4, children: [ undefined, undefined ], type: '.' },
  { text: 'u__2',   level: 4, children: [ undefined, 2 ], type: '_' },
  { text: 'l',      level: 4, children: [ undefined, undefined ], type: '.' },
  { text: 'r_.+',   level: 4, children: [ '+', undefined ], type: '_' },
  { text: 'p',      level: 4, children: [ undefined, undefined ], type: '.' },
  { text: 'j',      level: 4, children: [ undefined, '1' ], type: '_' },
  { text: 'b',      level: 4, children: [ '6', '=' ], type: '.' },
  { text: 'x',      level: 4, children: [ '/', undefined ], type: '_' },
  { text: 'c',      level: 4, children: [ undefined, undefined ], type: '.' },
  { text: 'y',      level: 4, children: [ undefined, undefined ], type: '_' },
  { text: 'z',      level: 4, children: [ '7', undefined ], type: '.' },
  { text: 'q',      level: 4, children: [ undefined, undefined ], type: '_' },
  { text: 'o..2',   level: 4, children: [ '8', undefined ], type: '.' },
  { text: 'o***',   level: 4, children: [ '9', '0' ], type: '_' } ,

  { text: '5',      level: 5, children: [ undefined, undefined ], type: "." },
  { text: '4',      level: 5, children: [ undefined, undefined ], type: "_" },
  { text: '3',      level: 5, children: [ undefined, undefined ], type: "_" },
  { text: '2',      level: 5, children: [ undefined, undefined ], type: "_" },
  { text: '+',      level: 5, children: [ undefined, undefined ], type: "." },
  { text: '1',      level: 5, children: [ undefined, undefined ], type: "_" },
  { text: '6',      level: 5, children: [ undefined, undefined ], type: "." },
  { text: '=',      level: 5, children: [ undefined, undefined ], type: "_" },
  { text: '/',      level: 5, children: [ undefined, undefined ], type: "." },
  { text: '7',      level: 5, children: [ undefined, undefined ], type: "." },
  { text: '8',      level: 5, children: [ undefined, undefined ], type: "." },
  { text: '9',      level: 5, children: [ undefined, undefined ], type: "." },
  { text: '0',      level: 5, children: [ undefined, undefined ], type: "_" },
]

module.exports = {
  encode, decode,
  decodePrefix,
  tree,
  validWordRegex: /^[\dA-Za-z+=/\s]*$/,
  validMorseRegex: /^[.\s_]*$/
}

