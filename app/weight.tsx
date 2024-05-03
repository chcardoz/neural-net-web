import { Component } from "react";

export class Weight extends Component {
	constructor(props: any) {
		super(props);
		this.state = {
			node1: null,
			node2: null
		};
	}

	// Function to update the references to the connected nodes
	setConnectedNodes = (node1: any, node2: any) => {
		this.setState({ node1, node2 });
	};

	render() {
		// Access node1 and node2 from state or props
		const { node1: any, node2: any } = this.state;

		return (
			<div>
				<h2>Weights Component</h2>
			</div>
		);
	}
}

export default Weight;
