"use client";

import React, { useState } from "react";
import AceEditor from "react-ace-builds";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import { ResizableBox } from "react-resizable";
import Draggable from "react-draggable";
import "react-resizable/css/styles.css";
import "material-icons/iconfont/material-icons.css";

function CodeEditor() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [resizeWidth, setResizeWidth] = useState(400);
    const [resizeHeight, setResizeHeight] = useState(400);

    function onChange(newValue: any) {
        console.log("change", newValue);
    }

    function toggleCollapse() {
        setIsCollapsed(!isCollapsed);
    }

    return (
        <Draggable handle=".handle">
            <div>
                <div
                    className="flex justify-between items-center bg-gray-200 p-1 handle"
                    style={{
                        width: resizeWidth,
                        boxShadow:
                            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                        border: "1px solid black",
                        borderRadius: !isCollapsed ? "1rem 1rem 0 0" : "1rem",
                        overflow: "hidden",
                    }}
                >
                    {" "}
                    <p className="ml-0.5">Code Editor</p>
                    <button className="text-xs p-1" onClick={toggleCollapse}>
                        {isCollapsed ? (
                            <span className="material-icons">
                                add_circle_outline
                            </span>
                        ) : (
                            <span className="material-icons">
                                remove_circle_outline
                            </span>
                        )}
                    </button>
                </div>
                <ResizableBox
                    width={400}
                    height={400}
                    minConstraints={[300, 200]}
                    maxConstraints={[800, 600]}
                    onResize={(e, data) => {
                        setResizeWidth(data.size.width);
                        setResizeHeight(data.size.height);
                    }}
                    style={{
                        borderRadius: "0 0 1rem 1rem",
                        boxShadow:
                            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                        overflow: "hidden",
                        border: "1px solid black",
                        visibility: isCollapsed ? "hidden" : "visible",
                    }}
                >
                    {!isCollapsed && (
                        <AceEditor
                            mode="javascript"
                            theme="monokai"
                            onChange={onChange}
                            name="Editor"
                            width={"100%"}
                            height="100%"
                            editorProps={{
                                $blockScrolling: true,
                            }}
                        />
                    )}
                </ResizableBox>
            </div>
        </Draggable>
    );
}

export default CodeEditor;
