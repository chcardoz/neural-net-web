"use client";

import { useState, useEffect } from "react";
import useASTAnalyzer from "@/lib/astanalyzer";

/**
 * Represents a value.
 */
class Value {
	/**
	 * The name of the value.
	 * @type {string | null}
	 */
	name: string | null;

	/**
	 * The numeric value.
	 * @type {number | null}
	 */
	value: number | null;

	/**
	 * The children values.
	 * @type {Array<Value> | null}
	 */
	children: Array<Value> | null;

	/**
	 * The operation associated with the value.
	 * @type {string}
	 */
	op: string;

	/**
	 * Constructs a new Value object.
	 * @param {string | null} name - The name of the value.
	 * @param {number} value - The numeric value.
	 * @param {Array<Value>} children - The children values.
	 * @param {string} op - The operation associated with the value.
	 */
	constructor(
		name: string | null,
		value: number,
		children: Array<Value>,
		op: string
	) {
		this.name = name;
		this.value = value;
		this.children = children;
		this.op = op;
	}
}

/**
 * Renders the Home component.
 *
 * @returns The rendered Home component.
 */
export default function Home() {
	const [graph, setGraph] = useState(null);
	const { message, handleMessageChange, parseResult, identifierMap } =
		useASTAnalyzer();

	return (
		<div className="flex h-screen">
			<div className="flex-grow bg-gray-200 p-4">
				<textarea
					value={message}
					onChange={handleMessageChange}
					className="flex-grow p-2 pl-4 rounded border border-gray-400 resize-none text-black w-full h-full"
					style={{ alignSelf: "flex-start", textAlign: "left" }}
					placeholder="Type your message here"
				/>
			</div>
			<div className="flex-1 flex flex-col items-start p-4">
				<div
					className="bg-gray-200 p-2 rounded text-black overflow-auto w-full h-full"
					style={{ maxHeight: "100vh" }}
				>
					<pre>
						{parseResult
							? JSON.stringify(parseResult, null, 2)
							: "Invalid JavaScript code"}
					</pre>{" "}
				</div>
			</div>
		</div>
	);
}

//  TODO: Add a debounce feature
// FIXME: fix the recursvive expresion
