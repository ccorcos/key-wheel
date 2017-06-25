import * as _ from "lodash"
import { modPos, modMinus } from "./mod-math"

// Pegs are the location of the 7 pegs.
export type Pegs = Array<number>

function distance(x: number, y: number): number {
  return modMinus(x, y, 12)
}

enum Spin {
  up,
  down,
}

export function tweak(pegs: Pegs, index: number): { pegs: Pegs; spin: Spin } {
  const downIndex = modPos(index - 1, pegs.length)
  const upIndex = modPos(index + 1, pegs.length)
  const down = pegs[downIndex]
  const up = pegs[upIndex]
  const it = pegs[index]
  if (distance(up, it) === 2 && distance(it, down) === 1) {
    const newPegs = _.clone(pegs)
    newPegs[index] += 1
    return { pegs: newPegs, spin: Spin.up }
  } else if (distance(up, it) === 1 && distance(it, down) === 2) {
    const newPegs = _.clone(pegs)
    newPegs[index] -= 1
    return { pegs: newPegs, spin: Spin.down }
  }
  return null
}

export function pegsToBools(pegs: Pegs) {
  const bools = Array(12).fill(false)
  pegs.forEach(note => {
    bools[note] = true
  })
  return bools
}

export function getPegsId(scale: Pegs): number {
  const binaryString = pegsToBools(scale)
    .map(bool => (bool ? "1" : "0"))
    .join("")
  return parseInt(binaryString, 2)
}

enum Direction {
  up,
  down,
  left,
  right,
}

export type Neighbors = {
  [peg: number]: {
    id: number // points to another scale id
    spin: Spin
    direction?: Direction // layout direction
  }
}

export type Scale = {
  id: number
  pegs: Pegs
  neighbors: Neighbors
}

export type Graph = {
  [id: number]: Scale
}

export function generateGraph(pegs: Pegs, graph: Graph = {}): Graph {
  const id = getPegsId(pegs)
  const neighbors: Neighbors = {}
  const scale: Scale = { id, pegs, neighbors }
  graph[id] = scale

  // try to tweak each peg, assign the neighbor, and recursively build the graph
  pegs.forEach((peg, index) => {
    const neighbor = tweak(pegs, index)
    if (neighbor) {
      const neighborId = getPegsId(neighbor.pegs)
      neighbors[index] = {
        id: neighborId,
        spin: neighbor.spin,
      }
      if (!graph[neighborId]) {
        generateGraph(neighbor.pegs, graph)
      }
    }
  })

  return graph
}
