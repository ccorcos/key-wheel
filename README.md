# Key Wheel [[Demo](https://ccorcos.github.io/key-wheel/)]

A friend of mine did a math thesis about group theory applied to musical scales.
This is an interactive visualization showing all 7-note scales (that of the
12-note diatonic scale) that have gaps no bigger than 2 and clumps no bigger
than 2.

Every note in the diatonic scale is represented in the circle on the left. The
colored notes represent a 7-note set that is the current scale. In the web to
the right, the highlighted node is the current scale and the edges represent all
1-note substitutions that give you a new scales within the given constraints
(i.e. gaps no bigger than 2 and clumps no bigger than 2). Hovering over an edge
shows you which not is going to move. And it turns out that any note that can
move can only move to one place. Can click the node at the other end of the edge
to change the scale my moving that note.

Here are some interesting things to explore:

* The circle of fifths is along the center axis.
* The topology of this graph wraps around at the edges into a cylinder.

That's it for now. Please let me know if you discover anything interesting from
this visualization!
