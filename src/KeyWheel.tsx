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
    let scaleComponents: Array<JSX.Element> = []
    let edgeComponents: Array<JSX.Element> = []
    const noteRadius = 10
    const noteSize = noteRadius * 2
    const edgePadding = 5
    const edgeLength = 50
    const edgeTotalLength = edgeLength + edgePadding * 2 + noteRadius
    const distanceBetweenNotes = edgeTotalLength + noteRadius
    const edgeWidth = 5
    const angleEdgeDistance = distanceBetweenNotes * Math.sin(Math.PI / 4)
    const origin: Point = {
      x: 6 * angleEdgeDistance,
      y: angleEdgeDistance + noteRadius,
    }

    const pendingScales: Array<{ point: Point; scale: Scale }> = []
    const entry = World.entryScale.get()
    pendingScales.push({ point: origin, scale: entry })
    rendered[entry.id] = true

    const selectedScale = World.selectedScale.get()

    while (pendingScales.length > 0) {
      const { point, scale } = pendingScales.shift()
      scaleComponents.push(
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
          onMouseEnter={() => World.hoveredScale.set(scale)}
          onMouseLeave={() => {
            if (World.hoveredScale.get().id === scale.id) {
              World.hoveredScale.set(null)
            }
          }}
        />
      )

      scale.edges.forEach(edge => {
        if (rendered[edge.id]) {
          return
        }
        rendered[edge.id] = true
        const rotation = edge.direction === Direction.up
          ? Math.PI / 4
          : edge.direction === Direction.right
            ? Math.PI * 3 / 4
            : edge.direction === Direction.down
              ? -Math.PI * 3 / 4
              : edge.direction === Direction.left ? -Math.PI / 4 : 0

        edgeComponents.push(
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
              onMouseEnter={() => World.hoveredEdge.set(edge)}
              onMouseLeave={() => {
                if (World.hoveredEdge.get().id === edge.id) {
                  World.hoveredEdge.set(null)
                }
              }}
            />
          </div>
        )

        if (!rendered[edge.toScale.id]) {
          rendered[edge.toScale.id] = true
          pendingScales.push({
            scale: edge.toScale,
            point: {
              x: point.x + distanceBetweenNotes * Math.sin(rotation),
              // remember +y is down the screen!
              y: point.y - distanceBetweenNotes * Math.cos(rotation),
            },
          })
        }
      })
    }

    return <div>{edgeComponents}{scaleComponents}</div>
  }
}

export default KeyWheel
