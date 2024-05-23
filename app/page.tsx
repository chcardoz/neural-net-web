"use client";
import useASTAnalyzer from "@/lib/useAstAnalyzer";
import ForceDirectedGraph from "@/lib/Graph";

/**
 * Renders the Home component.
 *
 * @returns The rendered Home component.
 */
export default function Home() {
	const {
		message,
		handleMessageChange,
		parseResult,
		declaredIdentifiers,
		finalValue
	} = useASTAnalyzer();

	return (
		<div className="flex h-screen">
			<div className="w-1/4 p-4">
				<textarea
					value={message}
					onChange={handleMessageChange}
					className="w-full h-1/2 p-2 pl-4 rounded border border-gray-400 resize-none text-black"
					placeholder="Type your message here"
				/>
				<div
					className="bg-gray-200 p-2 rounded text-black overflow-auto mt-4"
					style={{ height: "50%" }}
				>
					<pre>
						{parseResult
							? JSON.stringify(parseResult, null, 2)
							: "Invalid JavaScript code"}
					</pre>
				</div>
			</div>
			<div className="flex-1 p-4">
				<div className="bg-white p-2 rounded text-black overflow-auto w-full h-full flex items-center justify-center">
					<ForceDirectedGraph finalValue={finalValue} />
				</div>
			</div>
		</div>
	);
}

//  TODO: Add a debounce feature
