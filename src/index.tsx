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
			</div>
		)
	}
}

const root = document.createElement("div")
document.body.appendChild(root)

ReactDOM.render(<App />, root)
