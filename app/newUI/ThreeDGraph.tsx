"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import Floor from "../../components/Floor";
import Box from "../../components/Box";
import LightBulb from "../../components/LightBulb";
import OrbitControls from "../../components/OrbitControls";
import Draggable from "../../components/Draggable";

const ThreeDGraph: React.FC = () => {
    return (
        <div className="w-screen h-screen absolute inset-0">
            <Canvas
                shadows
                className="bg-black"
                camera={{
                    position: [-6, 7, 7],
                }}
            >
                <ambientLight color={"white"} intensity={0.2} />
                <LightBulb position={[0, 3, 0]} />
                <Draggable>
                    <Box rotateX={3} rotateY={0.2} />
                </Draggable>
                <OrbitControls />
                <Floor position={[0, -1, 0]} />
            </Canvas>
        </div>
    );
};

export default ThreeDGraph;
