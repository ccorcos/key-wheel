import * as React from "react"
import * as _ from "lodash"
import Component from "reactive-magic/component"
import { Pegs, pegsToBools } from "./utils"
import World from "./World"

interface ScalePegsProps {}

class ScalePegs extends Component<ScalePegsProps> {
  view() {
    const scaleRadius = 100
    const noteRadius = 30
    const center = { x: scaleRadius, y: scaleRadius }
    const pegs = World.selectedScale.get().pegs
    return (
      <div>
        {pegsToBools(pegs).map((note, index) => {
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                width: noteRadius,
                height: noteRadius,
                backgroundColor: note
                  ? World.pegColors[pegs.indexOf(index)]
                  : "white",
                border: "1px solid black",
                borderRadius: noteRadius,
                top:
                  center.y - scaleRadius * Math.cos(index * 2 * Math.PI / 12),
                left:
                  center.x + scaleRadius * Math.sin(index * 2 * Math.PI / 12),
              }}
            />
          )
        })}
      </div>
    )
  }
}

export default ScalePegs
