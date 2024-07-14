"use client";

import React, { useState } from "react";
import Nav from "@/components/Navbar/Nav";
import CodeEditor from "@/components/CodeEditor/CodeEditor";
import ThreeDGraph from "@/components/Graph/ThreeDGraph";
import SimpleGraph from "@/components/ThreeDGraph/SimpleGraph";
import VerySimpleGraph from "@/components/ThreeDGraph/VerySimpleGraph";
import Graphing from "@/components/ThreeDGraph/Graphing";

export default function HomePage() {
    const nodes = [
        { id: "1", label: "Node 1" },
        { id: "2", label: "Node 2" },
        { id: "3", label: "Node 3" },
        { id: "4", label: "Node 4" },
        { id: "5", label: "Node 5" },
        { id: "6", label: "Node 6" },
        { id: "7", label: "Node 7" },
        { id: "8", label: "Node 8" },
        { id: "9", label: "Node 9" },
        { id: "10", label: "Node 10" },
    ];

    const newNodes = [
        { id: "1", label: "Node 1" },
        { id: "2", label: "Node 2" },
        { id: "3", label: "Node 3" },
        { id: "4", label: "Node 4" },
        { id: "5", label: "Node 5" },
        { id: "6", label: "Node 6" },
        { id: "7", label: "Node 7" },
        { id: "8", label: "Node 8" },
        { id: "9", label: "Node 9" },
        { id: "10", label: "Node 10" },
        { id: "11", label: "Node 11" },
        { id: "12", label: "Node 12" },
        { id: "13", label: "Node 13" },
        { id: "14", label: "Node 14" },
        { id: "15", label: "Node 15" },
        { id: "16", label: "Node 16" },
        { id: "17", label: "Node 17" },
        { id: "18", label: "Node 18" },
        { id: "19", label: "Node 19" },
        { id: "20", label: "Node 20" },
    ];

    const edges = [
        { from: "1", to: "2" },
        { from: "1", to: "3" },
        { from: "2", to: "4" },
        { from: "3", to: "4" },
    ];

    const [renderNodes, setRenderNodes] = useState(nodes);

    function generateRandomNodes() {
        const newNodes = [];
        const length = Math.floor(Math.random() * 10) + 1;
        for (let i = 1; i <= length; i++) {
            newNodes.push({ id: i.toString(), label: `Node ${i}` });
        }
        return newNodes;
    }

    return (
        <>
            <Nav />
            {/* <div className="relative">
                <CodeEditor />
                <ThreeDGraph />
            </div> */}
            {/* <SimpleGraph /> */}
            {/* <VerySimpleGraph /> */}
            <button onClick={() => setRenderNodes(generateRandomNodes())}>
                Change Nodes
            </button>
            <Graphing nodes={renderNodes} edges={edges} />
        </>
    );
}
