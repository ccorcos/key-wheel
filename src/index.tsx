import React from "react"
import ReactDOM from "react-dom"
import ScalePegs from "./ScalePegs"
import KeyWheel from "./KeyWheel"
import { Pegs } from "./utils"

const maj: Pegs = [0, 2, 4, 5, 7, 9, 11]

function app() {
  return (
    <div>
      <ScalePegs pegs={maj} />
      <KeyWheel pegs={maj} />
    </div>
  )
}

const root = document.createElement("div")
document.body.appendChild(root)

ReactDOM.render(app(), root)
