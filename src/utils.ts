export type Scale = Array<boolean>
export type Interval = Array<number>

function scaleToInterval(scale: Scale): Interval {
  return scale
    .map((note, index) => (note ? index : -1))
    .filter(value => value !== -1)
}
