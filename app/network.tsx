"use client";

import { Component } from "react";
import { Layer } from "./layer";

export class Network extends Component {
	render() {
		return (
			<div className="flex">
				<div className="w-1/2 bg-gray-200 p-4">
					<Layer />
				</div>
				<div className="w-1/2 bg-blue-200 p-4">
					<Layer />
				</div>
			</div>
		);
	}
}

export default Network;
