import { Component } from "react";

export class Node extends Component {
	constructor(props: any) {
		super(props);
		this.state = {
			value: 0
		};
	}
	render() {
		return (
			<div className="flex items-center justify-center rounded-full w-16 h-16 bg-gray-500">
				<span className="text-white">{this.state.value}</span>
			</div>
		);
	}
}

export default Node;
