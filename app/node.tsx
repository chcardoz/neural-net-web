import { Component } from "react";

export class Node extends Component {
	render() {
		return (
			<div className="flex items-center justify-center rounded-full w-16 h-16 bg-gray-500">
				<span className="text-white">Node</span>
			</div>
		);
	}
}

export default Node;
