"use client";
import useCodeAnalyzer from "@/lib/grad-engine/useCodeAnalyzer";

import React, { useEffect } from "react";
import Nav from "@/components/Navbar/Nav";
import CodeEditor from "@/components/CodeEditor/CodeEditor";
import ForceDirectedGraph from "@/components/Graph/Graph";

export default function Home() {
    const { code, handleCodeChange, parseResult, tensorNameMap } =
        useCodeAnalyzer();

    useEffect(() => {
        console.log(tensorNameMap);
    }, [tensorNameMap]);

    return (
        <div className="h-screen w-screen">
            <Nav />
            <div className=" relative h-full">
                <CodeEditor code={code} handleCodeChange={handleCodeChange} />
                <ForceDirectedGraph
                    finalTensor={tensorNameMap.get("finalTensor")!}
                />
            </div>
        </div>
    );
}
