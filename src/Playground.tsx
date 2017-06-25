// Pegs are the location of the 7 pegs.
export type Pegs = Array<number>

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

// A Scale represents a set of notes
class Scale {
  id: number
  pegs: Pegs
  edges: { [peg: number]: Edge } = {}
  pentatonics: { [id: number]: Pentatonic } = {}
  constructor(pegs: Pegs) {
    this.pegs = pegs
    this.id = 1
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

// A pentatonic represents a loop, a set of four scales with similar notes
class Pentatonic {
  id: number
  scales: [Scale, Scale, Scale, Scale]
  constructor(scales: [Scale, Scale, Scale, Scale]) {
    this.scales = scales
    this.id = 1
  }
}
