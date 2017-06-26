import React from "react"
import ReactDOM from "react-dom"
import ScalePegs from "./ScalePegs"
import KeyWheel from "./KeyWheel"
import Info from "./Info"
import Component from "reactive-magic/component"

class App extends Component<{}> {
  view() {
    return (
      <div
        style={{
          position: "relative",
          width: 735,
          height: 600,
          marginTop: 100,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <KeyWheel />
        </div>
        <div style={{ position: "absolute", top: 250, left: 50 }}>
          <Info />
        </div>
        <div style={{ position: "absolute", top: 250, left: 400 }}>
          <ScalePegs />
        </div>
      </div>
    )
  }
}

const root = document.createElement("div")
document.body.appendChild(root)

ReactDOM.render(<App />, root)
