import * as React from "react"
import * as _ from "lodash"
import Component from "reactive-magic/component"
import { Pegs, Scale, createKeyWheelGraph, Direction } from "./utils"
import World from "./World"

interface KeyWheelProps {}

type Point = { x: number; y: number }

class KeyWheel extends Component<KeyWheelProps> {
  view() {
    const rendered: { [id: string]: boolean } = {}
    let components: Array<JSX.Element> = []
    const origin: Point = {
      x: 700,
      y: 300,
    }
    const noteRadius = 10
    const noteSize = noteRadius * 2
    const edgePadding = 5
    const edgeLength = 50
    const edgeTotalLength = edgeLength + edgePadding * 2 + noteRadius
    const distanceBetweenNotes = edgeTotalLength + noteRadius
    const edgeWidth = 5

    const pendingScales: Array<{ point: Point; scale: Scale }> = []
    const entry = World.entryScale.get()
    pendingScales.push({ point: origin, scale: entry })
    rendered[entry.id] = true

    const selectedScale = World.selectedScale.get()

    while (pendingScales.length > 0) {
      const { point, scale } = pendingScales.shift()
      components.push(
        <div
          key={scale.id}
          style={{
            position: "absolute",
            top: point.y - noteRadius,
            left: point.x - noteRadius,
            width: noteSize,
            height: noteSize,
            borderRadius: noteSize,
            backgroundColor: scale.id === selectedScale.id ? "white" : "black",
            cursor: "pointer",
            boxSizing: "border-box",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "black",
          }}
          onClick={() => World.selectedScale.set(scale)}
        />
      )

      scale.edges.forEach(edge => {
        if (rendered[edge.id]) {
          return
        }
        rendered[edge.id] = true
        const rotation = edge.direction === Direction.right
          ? -Math.PI / 4
          : edge.direction === Direction.down
            ? -Math.PI * 3 / 4
            : edge.direction === Direction.left
              ? Math.PI * 3 / 4
              : edge.direction === Direction.up ? Math.PI / 4 : 0
        components.push(
          <div
            key={edge.id}
            style={{
              position: "absolute",
              top: point.y - edgeTotalLength,
              left: point.x - edgeWidth / 2,
              width: edgeWidth,
              height: edgeTotalLength,
              transformOrigin: "center bottom",
              transform: `rotate(${rotation}rad)`,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: edgePadding,
                left: 0,
                width: edgeWidth,
                height: edgeLength,
                backgroundColor: World.pegColors[edge.peg],
              }}
            />
          </div>
        )
        if (!rendered[edge.toScale.id]) {
          rendered[edge.toScale.id] = true
          pendingScales.push({
            scale: edge.toScale,
            point: {
              x: point.x + distanceBetweenNotes * Math.cos(rotation),
              y: point.y + distanceBetweenNotes * Math.sin(rotation),
            },
          })
        }
      })
    }

    return <div>{components}</div>
  }
}

export default KeyWheel
