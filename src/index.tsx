import React from "react"
import ReactDOM from "react-dom"
import ScalePegs from "./ScalePegs"
import { Scale } from "./utils"

const maj: Scale = [
  true,
  false,
  true,
  false,
  true,
  true,
  false,
  true,
  false,
  true,
  false,
  true,
]

function app() {
  return (
    <div>
      <ScalePegs scale={maj} />
    </div>
  )
}

const root = document.createElement("div")
document.body.appendChild(root)

ReactDOM.render(app(), root)
