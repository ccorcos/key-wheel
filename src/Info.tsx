import * as React from "react"
import * as _ from "lodash"
import Component from "reactive-magic/component"
import World from "./World"
import { Edge, Direction } from "./utils"

interface InfoProps {}

const edgeInfo = (edge: Edge) => {
	return (
		<div key={edge.id} style={{ paddingLeft: 10, paddingTop: 10 }}>
			<div>{`peg: ${World.pegColors[edge.peg]}`}</div>
			<div>{`spin: ${edge.spin}`}</div>
			<div>{`direction: ${Direction[edge.direction]}`}</div>
			<div>{`scale: ${edge.toScale.id} (${parseInt(edge.toScale.id, 2)})`}</div>
		</div>
	)
}

class Info extends Component<InfoProps> {
	view() {
		const scale = World.hoveredScale.get()
		const edge = World.hoveredEdge.get()
		const style: React.CSSProperties = {
			fontFamily: "monospace",
		}
		if (scale) {
			return (
				<div style={style}>
					<div>{`scale: ${scale.id} (${parseInt(scale.id, 2)})`}</div>
					<div>edges: {scale.edges.map(edgeInfo)}</div>
				</div>
			)
		}
		if (edge) {
			return (
				<div style={style}>
					<div>{`edge: ${edge.id}`}</div>
					<div>{`from: ${edge.fromScale.id} (${parseInt(
						edge.fromScale.id,
						2
					)})`}</div>
					<div>{`to: ${edge.toScale.id} (${parseInt(
						edge.toScale.id,
						2
					)})`}</div>
					<div>{`spin: ${edge.spin}`}</div>
					<div>{`direction: ${Direction[edge.direction]}`}</div>
					<div>{`peg: ${World.pegColors[edge.peg]}`}</div>
				</div>
			)
		}
		return null
	}
}

export default Info
