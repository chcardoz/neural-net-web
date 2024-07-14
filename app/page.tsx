"use client";
import useASTAnalyzer from "@/lib/useAstAnalyzer";
import ForceDirectedGraph from "@/components/Graph/Graph";
import { useCallback, useEffect } from "react";
import debounce from "lodash.debounce";

import React, { useState } from "react";
import Nav from "@/components/Navbar/Nav";
import CodeEditor from "@/components/CodeEditor/CodeEditor";

/**
 * Renders the Home component.
 *
 * @returns The rendered Home component.
 */
export default function Home() {
    const {
        message,
        handleMessageChange,
        parseResult,
        identifierMap,
        finalValue,
    } = useASTAnalyzer();

    // Debounce the handleMessageChange function
    const debouncedHandleMessageChange = useCallback(
        debounce((event) => handleMessageChange(event), 800, {
            trailing: true,
        }), // 300ms debounce delay
        []
    );

    // Cleanup the debounce function on component unmount
    useEffect(() => {
        return () => {
            debouncedHandleMessageChange.cancel();
        };
    }, [debouncedHandleMessageChange]);

    useEffect(() => {
        console.log(identifierMap);
        console.log(finalValue);
    }, [identifierMap, finalValue]);

    return (
        <div className="h-screen w-screen">
            <Nav />
            <div className=" relative h-full">
                <CodeEditor
                    message={message}
                    handleMessageChange={handleMessageChange}
                />
                <ForceDirectedGraph finalValue={finalValue} />
            </div>
        </div>
    );
}
