"use client";

let acorn = require("acorn");
import { useState, useEffect } from "react";

export default function Home() {
	const [message, setMessage] = useState("");
	const [parseResult, setParseResult] = useState(null);

	const handleMessageChange = (e: any) => {
		setMessage(e.target.value);
	};

	useEffect(() => {
		try {
			setParseResult(acorn.parse(message, { ecmaVersion: 2020 }));
		} catch (error) {
			console.error("Parsing error: OHHHNOOO", error);
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
