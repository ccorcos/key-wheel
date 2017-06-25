import * as React from "react"
import * as _ from "lodash"
import Component from "reactive-magic/component"
import { Scale, scaleToInterval } from "./utils"

interface KeyWheelProps {
  scale: Scale
}

class KeyWheel extends Component<KeyWheelProps> {
  view() {
    const center = { x: 200, y: 200 }
    const scaleRadius = 100
    const noteRadius = 30
    return (
      <div>
        {this.props.scale.map((note, index) => {
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                width: noteRadius,
                height: noteRadius,
                backgroundColor: note ? "blue" : "white",
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

export default KeyWheel
