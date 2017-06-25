import React from "react"
import ReactDOM from "react-dom"

function app() {
  return (
    <div>
      hello world
    </div>
  )
}

const root = document.createElement("div")
document.body.appendChild(root)

ReactDOM.render(app(), root)
