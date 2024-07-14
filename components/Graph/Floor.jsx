//components/Floor.jsx

import React from "react";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

extend({ BoxGeometry: THREE.BoxGeometry }); // Extend BoxGeometry

function Floor(props) {
    return (
        <mesh {...props} receiveShadow>
            <boxGeometry args={[20, 1, 10]} />{" "}
            {/* Use boxGeometry instead of boxBufferGeometry */}
            <meshPhysicalMaterial color="white" />
        </mesh>
    );
}

export default Floor;
