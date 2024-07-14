"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

// Define types for nodes and edges
interface Node {
    id: string;
    label?: string;
    position?: THREE.Vector3;
}

interface Edge {
    from: string;
    to: string;
}

interface GraphProps {
    nodes: Node[];
    edges: Edge[];
}

const Sphere: React.FC<GraphProps> = ({ nodes, edges }) => {
    const meshRef = useRef<THREE.InstancedMesh>();

    // Position nodes in a sphere
    useEffect(() => {
        if (!meshRef.current) return;
        const t = new THREE.Object3D();
        const color = new THREE.Color();
        let j = 0;
        const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle in radians
        const offset = 2 / nodes.length;
        for (let i = 0; i < nodes.length; i += 1) {
            const y = i * offset - 1 + offset / 2;
            const r = Math.sqrt(1 - y * y);
            const theta = phi * i;
            t.position.x = Math.cos(theta) * r * 10;
            t.position.y = y * 10;
            t.position.z = Math.sin(theta) * r * 10;
            t.updateMatrix();
            color.setHSL(i / nodes.length, 1.0, 0.5);
            meshRef.current.setMatrixAt(j, t.matrix);
            meshRef.current.setColorAt(j, color);
            j++;
        }
    });

    const temp = new THREE.Matrix4();
    const tempPos = new THREE.Vector3();
    const tempRot = new THREE.Quaternion();
    const tempObj = new THREE.Object3D();
    const tempColor = new THREE.Color();
    // Rotate the graph
    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const time = clock.getElapsedTime();
        for (let i = 0; i < nodes.length; i++) {
            meshRef.current.getMatrixAt(i, temp);
            tempPos.setFromMatrixPosition(temp);
            tempRot.setFromRotationMatrix(temp);
            tempRot.x = time / 2;
            tempRot.y = time / 2;
            tempObj.position.set(tempPos.x, tempPos.y, tempPos.z);
            tempObj.setRotationFromQuaternion(tempRot);
            tempObj.updateMatrix();
            tempColor.setHSL((Math.random() * time) % 1, 1.0, 0.5);
            meshRef.current.setMatrixAt(i, tempObj.matrix);
            meshRef.current.setColorAt(i, tempColor);
        }
    });

    return (
        <>
            <color args={["#000000"]} attach="background" />
            <instancedMesh
                ref={meshRef as any}
                args={[undefined, undefined, nodes.length]}
                matrixAutoUpdate
            >
                <sphereGeometry args={[0.6, 20, 20]} />
                <meshStandardMaterial color="hotpink" />
            </instancedMesh>
        </>
    );
};

const Graph: React.FC<GraphProps> = ({ nodes, edges }) => {
    return (
        <Canvas
            camera={{ position: [0, 0, 50] }}
            style={{ width: "100vw", height: "100vh" }}
        >
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls />
            <Sphere nodes={nodes} edges={edges} />
        </Canvas>
    );
};

export default Graph;
