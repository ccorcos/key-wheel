import * as React from "react"
import * as _ from "lodash"
import Component from "reactive-magic/component"
import { Pegs, Scale, createKeyWheelGraph, Direction } from "./utils"

interface KeyWheelProps {
  pegs: Pegs
}

class KeyWheel extends Component<KeyWheelProps> {
  scale: Scale
  willMount() {
    this.scale = createKeyWheelGraph(this.props.pegs)
    console.log(this.scale)
  }
  view() {
    const rendered: { [id: string]: boolean } = {}
    let components: Array<JSX.Element> = []
    let origin = {
      x: 700,
      y: 300,
    }
    const noteRadius = 10
    const noteSize = noteRadius * 2
    const edgePadding = 5
    const edgeLength = 50
    const edgeTotalLength = edgeLength + edgePadding * 2 + noteRadius
    const edgeWidth = 5
    rendered[this.scale.id] = true
    components.push(
      <div
        key={this.scale.id}
        style={{
          position: "absolute",
          top: origin.y - noteRadius,
          left: origin.x - noteRadius,
          width: noteSize,
          height: noteSize,
          borderRadius: noteSize,
          backgroundColor: "black",
        }}
      />
    )

    this.scale.edges.forEach(edge => {
      rendered[edge.id] = true
      console.log(edge.direction)
      components.push(
        <div
          key={edge.id}
          style={{
            position: "absolute",
            top: origin.y - edgeTotalLength,
            left: origin.x - edgeWidth / 2,
            width: edgeWidth,
            height: edgeTotalLength,
            transformOrigin: "center bottom",
            transform: `rotate(${edge.direction === Direction.up
              ? -Math.PI / 4
              : edge.direction === Direction.right
                ? -Math.PI * 3 / 4
                : edge.direction === Direction.down
                  ? Math.PI * 3 / 4
                  : edge.direction === Direction.left ? Math.PI / 4 : 0}rad)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: edgePadding,
              left: 0,
              width: edgeWidth,
              height: edgeLength,
              backgroundColor: "black",
            }}
          />
        </div>
      )
    })

    return <div>{components}</div>
  }
}

export default KeyWheel
