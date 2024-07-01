"use client";

import React, { useState } from "react";
import Nav from "@/app/newUI/Nav";
import CodeEditor from "@/app/newUI/CodeEditor";
import ThreeDGraph from "@/app/newUI/ThreeDGraph";

const Home: React.FC = () => {
    return (
        <>
            <Nav />
            <div className="relative w-full h-screen bg-red-500">
                <ThreeDGraph />
                <CodeEditor style="absolute top-0 left-0 z-10" />
            </div>
        </>
    );
};

export default Home;
