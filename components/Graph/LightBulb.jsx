import React from "react";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

extend({ SphereGeometry: THREE.SphereGeometry }); // Extend BoxGeometry

function LightBulb(props) {
    return (
        <mesh {...props}>
            <pointLight castShadow />
            <sphereGeometry args={[0.2, 30, 10]} />
            <meshPhongMaterial emissive={"yellow"} />
        </mesh>
    );
}

export default LightBulb;
