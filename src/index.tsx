import React from "react"
import ReactDOM from "react-dom"
import ScalePegs from "./ScalePegs"
import KeyWheel from "./KeyWheel"
import Info from "./Info"
import Component from "reactive-magic/component"

class App extends Component<{}> {
	view() {
		return (
			<div>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						marginTop: 20,
					}}
				>
					<div
						style={{
							position: "relative",
							width: 233,
							height: 233,
							margin: 10,
						}}
					>
						<ScalePegs />
					</div>
					<div
						style={{
							position: "relative",
							width: 733,
							margin: 10,
							marginTop: 28,
						}}
					>
						<KeyWheel />
					</div>
				</div>
				<a
					href="https://github.com/ccorcos/key-wheel"
					target="_blank"
					style={{
						position: "absolute",
						top: 10,
						right: 20,
						fontFamily: "monospace",
					}}
				>
					source
				</a>
				<div
					style={{
						maxWidth: "35em",
						margin: "auto",
						marginTop: "2em",
						marginBottom: "4em",
						fontSize: 18,
						fontFamily: "Georgia,Cambria,'Times New Roman',Times,serif",
					}}
				>
					<p>
						A friend of mine did a math thesis about group theory applied to
						musical scales. This is an interactive visualization showing all
						7-note scales (that are a subset of the 12-note diatonic scale) that
						have gaps no bigger than 2 and clumps no bigger than 2.
					</p>
					<p>
						Every note in the diatonic scale is represented with the circle on
						the left. The colored notes represent a 7-note set that is the
						current scale. In the graph to the right, the highlighted node is
						the current scale and the edges represent all 1-note substitutions
						that give you a new scales within the given constraints (i.e. gaps
						no bigger than 2 and clumps no bigger than 2). Hovering over an edge
						shows you which note is going to move. And it turns out that any
						note that can move only has one place it can move to. You can click
						the node at the other end of the edge to change the scale.
					</p>
					<p>Here are some interesting things to explore:</p>
					<ul>
						<li>The circle of fifths is along the center axis.</li>
						<li>
							The topology of this graph wraps around at the edges into a
							cylinder.
						</li>
						<li>The inverse of this graph represents pentatonic scales.</li>
					</ul>
					<p>
						That's it for now. Please let me know if you discover anything
						interesting from this visualization!
					</p>
				</div>
			</div>
		)
	}
}

const root = document.createElement("div")
document.body.appendChild(root)

ReactDOM.render(<App />, root)
