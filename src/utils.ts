import * as _ from "lodash"
import { modPos, modMinus } from "./mod-math"

const TheWindow = window as any
TheWindow._ = _

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
export enum Direction {
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
export class Scale {
  id: string
  pegs: Pegs
  edges: Array<Edge> = []
  pentatonics: Array<Pentatonic> = []
  constructor(pegs: Pegs) {
    this.pegs = pegs
    this.id = Scale.makeScaleId(pegs)
    ScaleIndex.set(this.id, this)
  }

  findEdgeTo(scale: Scale): Edge {
    return this.edges.find(edge => edge.toScale.id === scale.id)
  }

  findEdgeDirection(direction: Direction): Edge {
    return this.edges.find(edge => edge.direction === direction)
  }

  isInPentatonic(pentatonic: Pentatonic) {
    return _.some(this.pentatonics, p => p.id === pentatonic.id)
  }

  hasDirection(direction: Direction) {
    return _.some(this.edges, edge => edge.direction === direction)
  }

  // Creates an id from a scale by creating a binary number
  static makeScaleId(pegs: Pegs): string {
    return pegsToBools(pegs).map(bool => (bool ? "1" : "0")).join("")
  }

  static lookup(pegs: Pegs): Scale {
    return ScaleIndex.get(Scale.makeScaleId(pegs))
  }

  static getCommonPentatonics(scales: Array<Scale>) {
    return _.intersection(...scales.map(scale => scale.pentatonics))
  }

  static getCommonPentatonic(scales: Array<Scale>) {
    return Scale.getCommonPentatonics(scales)[0]
  }
}

// An edge represents a one-note substitution to another scale
export class Edge {
  id: string
  peg: number
  fromScale: Scale
  toScale: Scale
  spin: Spin
  direction?: Direction
  constructor(peg: number, spin: Spin, fromScale: Scale, toScale: Scale) {
    // this id is the same for both spins!
    this.id = peg + bitwiseAndStrings(fromScale.id, toScale.id)
    this.fromScale = fromScale
    this.toScale = toScale
    this.spin = spin
    this.peg = peg
  }
}

const PentatonicIndex = new Index<Pentatonic>()

function bitwiseAndStrings(str1: string, str2: string): string {
  const chars = str1.split("")
  for (let i = 0; i < str1.length; i++) {
    chars[i] = str1[i] === "1" && str2[i] === "1" ? "1" : "0"
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
      return [scale.findEdgeTo(nextScale), nextScale.findEdgeTo(scale)]
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

function distance(x: number, y: number): number {
  return Math.abs(modMinus(x, y, 12))
}

// Tweak attempts to move a peg at a certain index. If it can, it will return
// a new set of pegs along with the spin, otherwise it returns null
function tweak(pegs: Pegs, index: number): { pegs: Pegs; spin: Spin } {
  const down = pegs[modPos(index - 1, pegs.length)]
  const downDown = pegs[modPos(index - 2, pegs.length)]
  const up = pegs[modPos(index + 1, pegs.length)]
  const upUp = pegs[modPos(index + 2, pegs.length)]
  const it = pegs[index]
  // Move a note up to an empty space without creating three steps in a row
  if (
    distance(up, it) === 2 &&
    distance(it, down) === 1 &&
    distance(upUp, up) !== 1
  ) {
    const newPegs = _.clone(pegs)
    newPegs[index] = modPos(newPegs[index] + 1, 12)
    return { pegs: newPegs, spin: Spin.up }
  }
  // Move a note down to an empty space without creating three steps in a row
  if (
    distance(up, it) === 1 &&
    distance(it, down) === 2 &&
    distance(down, downDown) !== 1
  ) {
    const newPegs = _.clone(pegs)
    newPegs[index] = modPos(newPegs[index] - 1, 12)
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
      scale.edges.push(new Edge(peg, result.spin, scale, nextScale))
    }
  })

  return scale
}

function permute(
  path: Array<Scale>,
  next: (path: Array<Scale>, edge: Edge) => boolean
): Array<Array<Scale>> {
  const scale = _.last(path)
  const edges = scale.edges.filter(edge => next(path, edge))
  if (edges.length === 0) {
    return []
  } else {
    // Breadth-First Search
    let paths = edges.map(edge => [...path, edge.toScale])
    const results: Array<Array<Scale>> = []
    while (paths.length > 0) {
      const path = paths.shift()
      const morePaths = permute(path, next)
      if (morePaths.length > 0) {
        paths = paths.concat(morePaths)
      } else {
        results.push(path)
      }
    }
    return results
  }
}

function findLoops(scale: Scale): Array<Array<Scale>> {
  // permute all paths of up to length 5 that don't go backwards
  const permutations = permute([scale], (path, edge) => {
    if (path.length === 5) {
      return false
    }
    // Complete the loop
    if (path.length === 4) {
      return edge.toScale.id === _.first(path).id
    }
    // Explore all directions
    if (path.length === 1) {
      return true
    }
    // No returning back over the scale
    if (_.nth(path, -2).id === edge.toScale.id) {
      return false
    }
    return true
  })
  const loops = permutations
    .filter(path => _.first(path).id === _.last(path).id)
    .map(path => _.initial(path))
  return loops
}

export function generatePentatonics(scale: Scale) {
  let foundNewPentatonic = false
  scale.pentatonics = _.uniq(
    findLoops(scale).map(path => {
      const pentatonic = Pentatonic.lookup(path)
      if (pentatonic) {
        return pentatonic
      } else {
        foundNewPentatonic = true
        return new Pentatonic(path)
      }
    })
  )
  if (foundNewPentatonic) {
    scale.edges.forEach(edge => {
      generatePentatonics(edge.toScale)
    })
  }
}

function rotateArray<Type>(list: Array<Type>, n: number): Array<Type> {
  return list.slice(n).concat(list.slice(0, n))
}

function matchCycle(edgeCycle: Array<Edge>, cycle: Array<Direction>): boolean {
  for (let i = 0; i < edgeCycle.length; i++) {
    const edge = edgeCycle[i]
    const direction = cycle[i]
    if (edge.direction === undefined) {
      // Check that we haven't already assigned this direction another edge
      // of the scale
      if (edge.fromScale.hasDirection(direction)) {
        return false
      }
      continue
    }
    if (edge.direction !== direction) {
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

function findCycle(edgeCycle: Array<Edge>): Array<Direction> {
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
  // You can't just assign directions of edges all willy-nilly, otherwise you
  // have an edge-coloring problem on your hands. However, we know that there's
  // an equator of scales that are all connected to each other. Let's start by
  // finding that equator.
  const equators = permute([scale], (path, edge) => {
    if (path.length === 13) {
      return false
    }
    if (path.length === 1) {
      return true
    }
    if (path.length === 2) {
      return edge.toScale.id !== _.first(path).id
    }
    if (path.length >= 3) {
      // Every 3 must share a pentatonic
      const pentatonic = Scale.getCommonPentatonic(path.slice(-3))
      if (!pentatonic) {
        return false
      }
      // The fourth should not share that same pentatonic otherwise its a loop
      if (edge.toScale.isInPentatonic(pentatonic)) {
        return false
      }
      return true
    }
  }).filter(path => _.first(path).id === _.last(path).id)
  // There will be two results, which are the reverse of each other
  const equator = _.initial(equators[0])

  // Now we can iterate through all the pentatonic scales and assign edge
  // directions to all of their scales. However, the order in which we do this
  // is important. If we start with all of the pentatonics that lie along the
  // equator, then we don't have any clusterfuck issues.
  let pentatonics: Array<Pentatonic> = []
  const path = equator.concat(equator.slice(0, 2))
  for (let i = 0; i < equator.length; i++) {
    pentatonics.push(Scale.getCommonPentatonic(path.slice(i, i + 3)))
  }

  // Keep track of whether a pentatonic is already pending a visit
  const visiting: { [id: string]: boolean } = {}
  pentatonics.forEach(pentatonic => {
    visiting[pentatonic.id] = true
  })

  while (pentatonics.length > 0) {
    const pentatonic = pentatonics.shift()
    let foundEmptyEdge = false
    const edgePairs = pentatonic.getEdgePairs()
    // We want to preserve the cycle directions that are already written
    // to the edges.
    const edgeCycle = edgePairs.map(([edge1]) => edge1)
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
      const more = pentatonic.scales
        .map(scale => scale.pentatonics)
        .reduce((acc, list) => acc.concat(list), [])
        .filter(pentatonic => !visiting[pentatonic.id])
      more.forEach(pentatonic => {
        visiting[pentatonic.id] = true
      })
      pentatonics = pentatonics.concat(more)
    }
  }
}

export function createKeyWheelGraph(pegs: Pegs) {
  const scale = generateGraph(pegs)
  generatePentatonics(scale)
  generateLayout(scale)
  return scale
}
