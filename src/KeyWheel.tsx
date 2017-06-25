import * as React from "react"
import * as _ from "lodash"
import Component from "reactive-magic/component"
import { Pegs, createKeyWheelGraph } from "./utils"

interface KeyWheelProps {
  pegs: Pegs
}

class KeyWheel extends Component<KeyWheelProps> {
  willMount() {
    console.log(createKeyWheelGraph(this.props.pegs))
  }
  view() {
    return <div />
  }
}

export default KeyWheel
