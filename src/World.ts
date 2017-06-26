import { Pegs, createKeyWheelGraph } from "./utils"
import { Value } from "reactive-magic"

const maj: Pegs = [0, 2, 4, 5, 7, 9, 11]
const entry = createKeyWheelGraph(maj)

class World {
  entryScale = new Value(entry)
  selectedScale = new Value(entry)
  pegColors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"]
}

const TheWorld = new World()

const TheWindow = window as any
TheWindow.World = TheWorld

export default TheWorld
