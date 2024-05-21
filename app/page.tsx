"use client";

import { useState, useEffect } from "react";
import useASTAnalyzer from "@/lib/astanalyzer";
import ValueList from "@/lib/valuelist";

/**
 * Renders the Home component.
 *
 * @returns The rendered Home component.
 */
export default function Home() {
	const [graph, setGraph] = useState(null);
	const [identifier, setIdentifier] = useState(new Set());
	const { message, handleMessageChange, parseResult, identifierMap } =
		useASTAnalyzer(setIdentifier);

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
					style={{ maxHeight: "50vh" }}
				>
					<pre>
						{parseResult
							? JSON.stringify(parseResult, null, 2)
							: "Invalid JavaScript code"}
					</pre>{" "}
				</div>
				<div
					className="bg-white p-2 rounded text-black overflow-auto w-full h-full"
					style={{ maxHeight: "50vh" }}
				>
					<h1> Nodes in the lists being printed out:</h1>
					<ValueList identifier={identifier} />
				</div>
			</div>
		</div>
	);
}

//  TODO: Add a debounce feature
