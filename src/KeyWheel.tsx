import * as React from "react"
import * as _ from "lodash"
import Component from "reactive-magic/component"
import { Pegs, generateGraph } from "./utils"

interface KeyWheelProps {
  pegs: Pegs
}

class KeyWheel extends Component<KeyWheelProps> {
  willMount() {
    const graph = generateGraph(this.props.pegs)
    console.log(graph, Object.keys(graph).length)
  }
  view() {
    return <div />
  }
}

export default KeyWheel
