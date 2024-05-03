"use client";

import { Component } from "react";
import { Layer } from "./layer";

export class Network extends Component {
	render() {
		return (
			<div>
				<Layer />
				network
				<Layer />
			</div>
		);
	}
}

export default Network;
