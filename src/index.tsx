import React from "react"
import ReactDOM from "react-dom"
import ScalePegs from "./ScalePegs"
import KeyWheel from "./KeyWheel"
import Component from "reactive-magic/component"

class App extends Component<{}> {
  view() {
    return (
      <div>
        <ScalePegs />
        <KeyWheel />
      </div>
    )
  }
}

const root = document.createElement("div")
document.body.appendChild(root)

ReactDOM.render(<App />, root)
