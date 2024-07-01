"use client";

import React from "react";
import css from "../../styles/3DGraphing.module.css";
import { Canvas } from "@react-three/fiber";
import Floor from "../../components/Floor";
import Box from "../../components/Box";
import LightBulb from "../../components/LightBulb";
import OrbitControls from "../../components/OrbitControls";
import Draggable from "../../components/Draggable";

const Home: React.FC = () => {
    return (
        <div className={css.scene}>
            <Canvas
                shadows
                className={css.canvas}
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

export default Home;
