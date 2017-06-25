import * as _ from "lodash"
import { modPos, modMinus } from "./mod-math"

// Pegs are the location of the 7 pegs.
export type Pegs = Array<number>

// Turns a list of pegs into a length 12 list of bools
export function pegsToBools(pegs: Pegs) {
  const bools = Array(12).fill(false)
  pegs.forEach(note => {
    bools[note] = true
  })
  return bools
}

// Spin is the direction that a peg was moves.
enum Spin {
  up,
  down,
}

// Direction is the direction that the edge should be layed out on the lattice.
enum Direction {
  up,
  down,
  left,
  right,
}

class Index<Type> {
  index: { [id: string]: Type } = {}
  get(id: string) {
    return this.index[id]
  }
  set(id: string, value: Type) {
    this.index[id] = value
  }
}

const ScaleIndex = new Index<Scale>()

// A Scale represents a set of notes
class Scale {
  id: string
  pegs: Pegs
  edges: Array<Edge> = []
  pentatonics: Array<Pentatonic> = []
  constructor(pegs: Pegs) {
    this.pegs = pegs
    this.id = Scale.makeScaleId(pegs)
    ScaleIndex.set(this.id, this)
  }

  findEdge(scale: Scale): Edge {
    return this.edges.find(edge => edge.scale.id === scale.id)
  }

  // Creates an id from a scale by creating a binary number
  static makeScaleId(pegs: Pegs): string {
    return pegsToBools(pegs).map(bool => (bool ? "1" : "0")).join("")
  }

  static lookup(pegs: Pegs): Scale {
    return ScaleIndex.get(Scale.makeScaleId(pegs))
  }
}

// An edge represents a one-note substitution to another scale
class Edge {
  peg: number
  scale: Scale
  spin: Spin
  direction?: Direction
  constructor(peg: number, spin: Spin, scale: Scale) {
    this.scale = scale
    this.spin = spin
    this.peg = peg
  }
}

const PentatonicIndex = new Index<Pentatonic>()

function bitwiseAndStrings(str1: string, str2: string): string {
  const chars = str1.split("")
  for (let i = 0; i < str1.length; i++) {
    chars[i] = str1[i] === "1" || str2[i] === "1" ? "1" : "0"
  }
  return chars.join("")
}

// A pentatonic represents a loop, a set of four scales with similar notes
class Pentatonic {
  id: string
  scales: Array<Scale>
  constructor(scales: Array<Scale>) {
    this.scales = scales
    this.id = Pentatonic.makePentatonicId(scales)
    PentatonicIndex.set(this.id, this)
  }

  getEdgePairs(): Array<Array<Edge>> {
    return this.scales.map((scale, index) => {
      const nextScale = this.scales[modPos(index + 1, this.scales.length)]
      return [scale.findEdge(nextScale), nextScale.findEdge(scale)]
    })
  }

  // A pentatonic can be identified by the common notes between all of
  // its scales, so we use a bitwise AND
  static makePentatonicId(scales: Array<Scale>): string {
    return scales.map(scale => scale.id).reduce(bitwiseAndStrings)
  }

  static lookup(scales: Array<Scale>): Pentatonic {
    return PentatonicIndex.get(Pentatonic.makePentatonicId(scales))
  }
}

// Tweak attempts to move a peg at a certain index. If it can, it will return
// a new set of pegs along with the spin, otherwise it returns null
function tweak(pegs: Pegs, index: number): { pegs: Pegs; spin: Spin } {
  const downIndex = modPos(index - 1, pegs.length)
  const upIndex = modPos(index + 1, pegs.length)
  const down = pegs[downIndex]
  const up = pegs[upIndex]
  const it = pegs[index]
  if (modMinus(up, it, 12) === 2 && modMinus(it, down, 12) === 1) {
    const newPegs = _.clone(pegs)
    newPegs[index] += 1
    return { pegs: newPegs, spin: Spin.up }
  } else if (modMinus(up, it, 12) === 1 && modMinus(it, down, 12) === 2) {
    const newPegs = _.clone(pegs)
    newPegs[index] -= 1
    return { pegs: newPegs, spin: Spin.down }
  }
  return null
}

// Generates the graph of connected scales, but does not compute the layout
// or associate with the pentatonics
function generateGraph(pegs: Pegs): Scale {
  const scale: Scale = new Scale(pegs)

  pegs.forEach((ignore, peg) => {
    // try to tweak each peg
    const result = tweak(pegs, peg)
    if (result) {
      // recursively build each scale
      let nextScale = Scale.lookup(result.pegs)
      if (!nextScale) {
        nextScale = generateGraph(result.pegs)
      }
      // assign the edge
      scale.edges.push(new Edge(peg, result.spin, nextScale))
    }
  })

  return scale
}

function permutePaths(
  scale: Scale,
  parent: Scale,
  depth: number
): Array<Array<Scale>> {
  if (depth === 0) {
    return []
  }
  const paths = scale.edges
    .filter(edge => (parent ? edge.scale.id !== parent.id : true))
    .map(edge => permutePaths(edge.scale, scale, depth - 1))
    .reduce((acc, paths) => acc.concat(paths), [])
    .map(path => [parent, ...path])
  return paths
}

export function generatePentatonics(scale: Scale) {
  let foundNewPentatonic = false
  console.log(permutePaths(scale, null, 4))
  scale.pentatonics = permutePaths(scale, null, 4)
    .filter(path => _.first(path).id === _.last(path).id)
    .map(scales => {
      const pentatonic = Pentatonic.lookup(scales)
      if (pentatonic) {
        return pentatonic
      } else {
        foundNewPentatonic = true
        return new Pentatonic(scales)
      }
    })
  if (foundNewPentatonic) {
    scale.edges.forEach(edge => {
      generatePentatonics(edge.scale)
    })
  }
}

function rotateArray<Type>(list: Array<Type>, n: number): Array<Type> {
  return list.slice(n).concat(list.slice(0, n))
}

function matchCycle(
  edgeCycle: Array<Direction>,
  cycle: Array<Direction>
): boolean {
  for (let i = 0; i < edgeCycle.length; i++) {
    if (edgeCycle[i] !== undefined && edgeCycle[i] !== cycle[i]) {
      return false
    }
  }
  return true
}

const cycleForward = [
  Direction.up,
  Direction.right,
  Direction.down,
  Direction.left,
]

const cycleBackward = [
  Direction.up,
  Direction.left,
  Direction.down,
  Direction.right,
]

const opposites = {
  [Direction.up]: Direction.down,
  [Direction.down]: Direction.up,
  [Direction.left]: Direction.right,
  [Direction.right]: Direction.left,
}

function findCycle(edgeCycle: Array<Direction>): Array<Direction> {
  for (let i = 0; i < cycleForward.length; i++) {
    const cycle = rotateArray(cycleForward, i)
    if (matchCycle(edgeCycle, cycle)) {
      return cycle
    }
  }
  for (let i = 0; i < cycleBackward.length; i++) {
    const cycle = rotateArray(cycleBackward, i)
    if (matchCycle(edgeCycle, cycle)) {
      return cycle
    }
  }
  throw new Error("Couldn't match the cycle!")
}

function generateLayout(scale: Scale) {
  scale.pentatonics.forEach(pentatonic => {
    let foundEmptyEdge = false
    const edgePairs = pentatonic.getEdgePairs()
    // We want to preserve the cycle directions that are already written
    // to the edges.
    const edgeCycle = edgePairs.map(([edge1]) => edge1.direction)
    const cycle = findCycle(edgeCycle)
    edgePairs.forEach(([edge1, edge2], index) => {
      const direction = cycle[index]
      const opposite = opposites[direction]
      if (edge1.direction !== undefined && edge1.direction !== direction) {
        throw Error("Direction clusterfuck")
      }
      if (edge2.direction !== undefined && edge2.direction !== opposite) {
        throw Error("Direction clusterfuck")
      }
      if (edge1.direction === undefined || edge2.direction === undefined) {
        edge1.direction = direction
        edge2.direction = opposite
        foundEmptyEdge = true
      }
    })
    if (foundEmptyEdge) {
      pentatonic.scales.map(generateLayout)
    }
  })
}

export function createKeyWheelGraph(pegs: Pegs) {
  const scale = generateGraph(pegs)
  generatePentatonics(scale)
  generateLayout(scale)
  return scale
}
