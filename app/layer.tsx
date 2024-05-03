import { Component } from "react";
import { Node } from "./node";

export class Layer extends Component {
	render() {
		return (
			<div>
				<Node />
				<Node />
				layers
			</div>
		);
	}
}

export default Layer;
