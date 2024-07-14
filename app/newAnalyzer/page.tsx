"use client";
import useCodeAnalyzer from "@/lib/useCodeAnalyzer";
import { useEffect } from "react";

export default function Home() {
    const {
        code,
        handleCodeChange,
        parseResult,
        variableCreationHistory,
        variableNameMap,
    } = useCodeAnalyzer();

    useEffect(() => {
        console.log("variables: ", variableCreationHistory);
        console.log("variableMap: ", variableNameMap);
    }, [variableCreationHistory, variableNameMap]);

    return (
        <div className="flex h-screen">
            <div className="w-1/4 p-4">
                <textarea
                    value={code}
                    onChange={handleCodeChange}
                    className="w-full h-1/2 p-2 pl-4 rounded border border-gray-400 resize-none text-black text-sm"
                    placeholder="Type your message here"
                />
                <div
                    className="bg-gray-200 p-2 rounded text-black text-sm text-ellipsis overflow-auto mt-4"
                    style={{ height: "50%" }}
                >
                    <pre>
                        {parseResult
                            ? JSON.stringify(parseResult, null, 2)
                            : "Invalid JavaScript code"}
                    </pre>
                </div>
            </div>
        </div>
    );
}
