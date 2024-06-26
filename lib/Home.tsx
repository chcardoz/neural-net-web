"use client";

import React, { useState } from "react";
import Nav from "@/app/newUI/Nav";
import CodeEditor from "@/app/newUI/CodeEditor";

const Home: React.FC = () => {
    return (
        <>
            <Nav />
            <CodeEditor />
        </>
    );
};

export default Home;
