"use Client";

import React, { useState } from "react";
import Nav from "@/components/Navbar/Nav";
import CodeEditor from "@/components/CodeEditor/CodeEditor";
import ThreeDGraph from "@/components/Graph/ThreeDGraph";
import SimpleGraph from "@/components/ThreeDGraph/SimpleGraph";
import VerySimpleGraph from "@/components/ThreeDGraph/VerySimpleGraph";

export default function HomePage() {
    return (
        <>
            <Nav />
            {/* <div className="relative">
                <CodeEditor />
                <ThreeDGraph />
            </div> */}
            {/* <SimpleGraph /> */}
            <VerySimpleGraph />
        </>
    );
}
