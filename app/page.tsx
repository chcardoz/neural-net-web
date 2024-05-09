"use client";

let acorn = require("acorn");
import { useState, useEffect } from "react";

export default function Home() {
	const [message, setMessage] = useState("");
	const [parseResult, setParseResult] = useState(null);
	const [graph, setGraph] = useState(null);
	const [identifier, setIdentifier] = useState(new Set());

	const addIdentifier = (id: string) => {
		setIdentifier(new Set([...identifier, id]));
	};

	const handleMessageChange = (e: any) => {
		setMessage(e.target.value);
	};

	useEffect(() => {
		try {
			setParseResult(acorn.parse(message, { ecmaVersion: 2020 }));
			console.log("====================================");
			console.log(parseResult?.body);
			console.log("====================================");
			// read thorough and save all identifiers and print it
			// FIXME : when the first letter typed is an identifier, It is not being recognized. Although pareResult is being updated, the identifier is not being updated.
			if (parseResult?.body) {
				for (let i = 0; i < parseResult?.body.length; i++) {
					addIdentifier(parseResult?.body[i]?.expression?.left?.name);
				}
			}

			console.log(identifier);
		} catch (error) {
			console.log("Invalid JavaScript code");
		}
		console.log(parseResult);
	}, [message]);

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
					className="flex-grow bg-white p-2 rounded text-black overflow-auto w-full h-full"
					style={{ maxHeight: "50vh", marginBottom: "1rem" }}
				></div>
			</div>
		</div>
	);
}
