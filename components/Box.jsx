import React from "react";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

extend({ BoxGeometry: THREE.BoxGeometry }); // Extend BoxGeometry

function Box(props) {
    return (
        <mesh {...props} recieveShadow={true} castShadow>
            <boxGeometry />
            <meshPhysicalMaterial color={"white"} />
        </mesh>
    );
}
export default Box;
