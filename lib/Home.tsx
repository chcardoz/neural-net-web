"use client";

import React, { useState } from "react";
import Nav from "@/app/newUI/Nav";
import AceEditor from "react-ace-builds";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import { ResizableBox } from "react-resizable";
import Draggable from "react-draggable";
import "react-resizable/css/styles.css";

const Home: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    function onChange(newValue: any) {
        console.log("change", newValue);
    }

    return (
        <>
            <Nav />
            <Draggable handle=".handle">
                <div className="relative z-50 w-full max-w-full">
                    <div className="handle flex justify-between items-center p-2 cursor-move">
                        <span>Editor</span>
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="text-lg  bg-black text-white focus:outline-none"
                        >
                            {isCollapsed ? "+" : "-"}
                        </button>
                    </div>
                    {!isCollapsed && (
                        <ResizableBox
                            width={500}
                            height={400}
                            minConstraints={[300, 200]}
                            maxConstraints={[800, 600]}
                            className="w-full"
                        >
                            <div className="border border-gray-300 bg-white h-full">
                                <AceEditor
                                    mode="javascript"
                                    theme="monokai"
                                    onChange={onChange}
                                    name="Editor"
                                    width="100%"
                                    height="100%"
                                    editorProps={{ $blockScrolling: true }}
                                />
                            </div>
                        </ResizableBox>
                    )}
                </div>
            </Draggable>
        </>
    );
};

export default Home;
