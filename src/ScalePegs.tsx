import * as React from "react"
import * as _ from "lodash"
import Component from "reactive-magic/component"
import { Pegs, pegsToBools, boolIndexToPeg } from "./utils"
import World from "./World"

interface ScalePegsProps {}

class ScalePegs extends Component<ScalePegsProps> {
	view() {
		const scaleRadius = 100
		const noteRadius = 30
		const center = { x: scaleRadius, y: scaleRadius }
		const pegs = World.selectedScale.get().pegs

		const bools = pegsToBools(pegs)
		return (
			<div>
				{bools.map((note, index) => {
					const peg = boolIndexToPeg(bools, index)
					const hoveredEdge = World.hoveredEdge.get()
					const hoveredScale = World.hoveredScale.get()
					const selectedScale = World.selectedScale.get()

					const noEdgeHovered = !hoveredEdge
					const isEdgeHovered = hoveredEdge && hoveredEdge.peg === peg

					const noScaleHovered = !hoveredScale
					const isHoveredScale =
						hoveredScale && hoveredScale.pegs.indexOf(index) !== -1

					let opacity: number
					let backgroundColor = World.pegColors[pegs.indexOf(index)]
					if (noEdgeHovered && noScaleHovered) {
						opacity = 1
						if (!note) {
							backgroundColor = "white"
						}
					} else if (!noEdgeHovered) {
						if (isEdgeHovered) {
							opacity = 0.4
						} else {
							opacity = 1.0
						}
						if (!note) {
							backgroundColor = "white"
						}
					} else {
						if (note && isHoveredScale) {
							opacity = 1
						} else if (!note && isHoveredScale) {
							opacity = 0.4
							backgroundColor =
								World.pegColors[hoveredScale.pegs.indexOf(index)]
						} else if (note && !isHoveredScale) {
							backgroundColor = "white"
						}
					}

					return (
						<div
							key={index}
							style={{
								position: "absolute",
								width: noteRadius,
								height: noteRadius,
								backgroundColor,
								border: "1px solid black",
								borderRadius: noteRadius,
								top:
									center.y - scaleRadius * Math.cos(index * 2 * Math.PI / 12),
								left:
									center.x + scaleRadius * Math.sin(index * 2 * Math.PI / 12),
								opacity,
								transition: "opacity 200ms",
							}}
						/>
					)
				})}
			</div>
		)
	}
}

export default ScalePegs
