import { Pegs, Scale, Edge, createKeyWheelGraph } from "./utils"
import { Value } from "reactive-magic"
import * as chroma from "chroma-js"

const maj: Pegs = [0, 2, 4, 5, 7, 9, 11]
const entry = createKeyWheelGraph(maj)

class World {
	entryScale = new Value(entry)
	selectedScale = new Value(entry)
	pegColors = chroma
		.cubehelix()
		.start(120)
		.rotations(-2)
		.gamma(1.0)
		.lightness([0.3, 0.8])
		.scale() // convert to chroma.scale
		.correctLightness()
		.colors(7)
	hoveredScale: Value<Scale> = new Value(null)
	hoveredEdge: Value<Edge> = new Value(null)
}

const TheWorld = new World()

const TheWindow = window as any
TheWindow.World = TheWorld

export default TheWorld
