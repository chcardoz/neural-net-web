import React, { useState } from "react";
import Nav from "@/components/Graph/Nav";
import CodeEditor from "@/components/CodeEditor/CodeEditor";
import ThreeDGraph from "@/components/Graph/ThreeDGraph";

export default function HomePage() {
    return (
        <>
            <Nav />
            <div className="relative">
                <CodeEditor />
                <ThreeDGraph />
            </div>
        </>
    );
}
