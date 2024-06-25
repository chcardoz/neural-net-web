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

    function toggleCollapse() {
        setIsCollapsed(!isCollapsed);
    }

    return (
        <>
            <Nav />
            <div className="relative z-10 shadow-lg w-full max-w-full bg-black">
                <Draggable handle=".handle">
                    <div className="flex flex-col">
                        {
                            <ResizableBox
                                width={500}
                                height={800}
                                minConstraints={[300, 200]}
                                maxConstraints={[800, 600]}
                                className="w-full rounded-lg shadow-lg"
                            >
                                <div className="flex justify-between items-center bg-gray-200 p-2 handle">
                                    {" "}
                                    <p>Drag Bar</p>
                                    <button
                                        className="text-xs p-1"
                                        onClick={toggleCollapse}
                                    >
                                        Button
                                    </button>
                                </div>
                                {!isCollapsed && (
                                    <div className="border border-gray-300 bg-white h-full">
                                        <AceEditor
                                            mode="javascript"
                                            theme="monokai"
                                            onChange={onChange}
                                            name="Editor"
                                            width="100%"
                                            height="100%"
                                            editorProps={{
                                                $blockScrolling: true,
                                            }}
                                        />
                                    </div>
                                )}
                            </ResizableBox>
                        }
                    </div>
                </Draggable>
            </div>
        </>
    );
};

export default Home;
