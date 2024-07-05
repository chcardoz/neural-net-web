"use client";

import React, { useState } from "react";
import Nav from "@/app/newUI/Nav";
import CodeEditor from "@/app/newUI/CodeEditor";
import ThreeDGraph from "@/app/newUI/ThreeDGraph";

const Home: React.FC = () => {
    return (
        <>
            <Nav />
            <div className="relative">
                <CodeEditor />
                <ThreeDGraph />
            </div>
        </>
    );
};

export default Home;
