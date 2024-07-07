"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import GRAPHVIS from "../../lib/graph.js"; // Make sure to include the path to graphvis
import Layout from "../../lib/force-directed-layout.js"; // Make sure to include the path to layout
import Stats from "../../lib/Stats.js"; // If you use Stats.js for FPS box
import "../../lib/Label.js"; // Make sure to include the path to Label.js
import "../../lib/ObjectSelection.js";

const SimpleGraph = ({
    layout = "3d",
    showStats = false,
    showInfo = true,
    showLabels = false,
    selection = true,
    limit = 10,
    numNodes = 50,
    numEdges = 10,
    graphLayout = { attraction: 5, repulsion: 0.5 },
}) => {
    const containerRef = useRef();

    useEffect(() => {
        let camera,
            controls,
            scene,
            renderer,
            interaction,
            geometry,
            objectSelection;
        let stats;
        let infoText = {};
        let geometries = [];

        const graph = new GRAPHVIS.Graph({ limit });

        // Initialize Three.js renderer, scene, and camera
        const init = () => {
            renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true,
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            camera = new THREE.PerspectiveCamera(
                40,
                window.innerWidth / window.innerHeight,
                1,
                1000000
            );
            camera.position.z = 10000;

            controls = new TrackballControls(camera, renderer.domElement);
            controls.rotateSpeed = 0.5;
            controls.zoomSpeed = 5.2;
            controls.panSpeed = 1;
            controls.staticMoving = false;
            controls.dynamicDampingFactor = 0.3;
            controls.keys = [65, 83, 68];
            controls.addEventListener("change", render);

            scene = new THREE.Scene();

            geometry =
                layout === "3d"
                    ? new THREE.SphereGeometry(30)
                    : new THREE.BoxGeometry(50, 50, 0);

            if (selection) {
                objectSelection = new THREE.ObjectSelection({
                    domElement: renderer.domElement,
                    selected: (obj) => {
                        if (obj !== null) {
                            infoText.select = `Object ${obj.customId}`;
                        } else {
                            delete infoText.select;
                        }
                    },
                    clicked: (obj) => {},
                });
            }

            containerRef.current.appendChild(renderer.domElement);

            if (showStats) {
                stats = new Stats();
                stats.domElement.style.position = "absolute";
                stats.domElement.style.top = "0px";
                containerRef.current.appendChild(stats.domElement);
            }

            if (showInfo) {
                const info = document.createElement("div");
                info.setAttribute("id", "graph-info");
                containerRef.current.appendChild(info);
            }
        };

        // Create a graph with random nodes and edges
        const createGraph = () => {
            const node = new GRAPHVIS.Node(0);
            node.data.title = `This is node ${node.id}`;
            graph.addNode(node);
            drawNode(node);

            const nodes = [node];
            let steps = 1;

            while (nodes.length !== 0 && steps < numNodes) {
                const node = nodes.shift();
                const numEdgesToCreate = randomFromTo(1, numEdges);

                for (let i = 1; i <= numEdgesToCreate; i++) {
                    const targetNode = new GRAPHVIS.Node(i * steps);

                    if (graph.addNode(targetNode)) {
                        targetNode.data.title = `This is node ${targetNode.id}`;

                        drawNode(targetNode);
                        nodes.push(targetNode);

                        if (graph.addEdge(node, targetNode)) {
                            drawEdge(node, targetNode);
                        }
                    }
                }

                steps++;
            }

            graphLayout.width = graphLayout.width || 2000;
            graphLayout.height = graphLayout.height || 2000;
            graphLayout.iterations = graphLayout.iterations || 100000;
            graphLayout.layout = graphLayout.layout || layout;
            graph.layout = new Layout.ForceDirected(graph, graphLayout);
            graph.layout.init();
            infoText.nodes = `Nodes ${graph.nodes.length}`;
            infoText.edges = `Edges ${graph.edges.length}`;
        };

        // Create and add a node to the scene
        const drawNode = (node) => {
            const drawObject = new THREE.Mesh(
                geometry,
                new THREE.MeshBasicMaterial({
                    color: Math.random() * 0xe0e0e0,
                    opacity: 0.8,
                })
            );

            if (showLabels) {
                const labelObject =
                    node.data.title !== undefined
                        ? new THREE.Label(node.data.title)
                        : new THREE.Label(node.id);
                node.data.labelObject = labelObject;
                scene.add(node.data.labelObject);
            }

            const area = 5000;
            drawObject.position.x = Math.floor(
                Math.random() * (area + area + 1) - area
            );
            drawObject.position.y = Math.floor(
                Math.random() * (area + area + 1) - area
            );

            if (layout === "3d") {
                drawObject.position.z = Math.floor(
                    Math.random() * (area + area + 1) - area
                );
            }

            drawObject.customId = node.id;
            node.data.drawObject = drawObject;
            node.position = drawObject.position;
            scene.add(node.data.drawObject);
        };

        // Create and add an edge (line) to the scene
        const drawEdge = (source, target) => {
            const material = new THREE.LineBasicMaterial({ color: 0x606060 });

            const tmpGeo = new THREE.BufferGeometry();
            const vertices = new Float32Array([
                source.data.drawObject.position.x,
                source.data.drawObject.position.y,
                source.data.drawObject.position.z,
                target.data.drawObject.position.x,
                target.data.drawObject.position.y,
                target.data.drawObject.position.z,
            ]);

            tmpGeo.setAttribute(
                "position",
                new THREE.BufferAttribute(vertices, 3)
            );

            const line = new THREE.LineSegments(tmpGeo, material);
            line.scale.x = line.scale.y = line.scale.z = 1;
            line.originalScale = 1;
            line.frustumCulled = false;

            geometries.push(tmpGeo);

            scene.add(line);
        };

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            render();
            if (showInfo) {
                printInfo();
            }
        };

        const render = () => {
            if (!graph.layout.finished) {
                infoText.calc =
                    "<span style='color: red'>Calculating layout...</span>";
                graph.layout.generate();
            } else {
                infoText.calc = "";
            }

            geometries.forEach((geometry) => {
                geometry.verticesNeedUpdate = true;
            });

            if (showLabels) {
                graph.nodes.forEach((node) => {
                    if (node.data.labelObject !== undefined) {
                        node.data.labelObject.position.x =
                            node.data.drawObject.position.x;
                        node.data.labelObject.position.y =
                            node.data.drawObject.position.y - 100;
                        node.data.labelObject.position.z =
                            node.data.drawObject.position.z;
                        node.data.labelObject.lookAt(camera.position);
                    } else {
                        const labelObject =
                            node.data.title !== undefined
                                ? new THREE.Label(
                                      node.data.title,
                                      node.data.drawObject
                                  )
                                : new THREE.Label(
                                      node.id,
                                      node.data.drawObject
                                  );
                        node.data.labelObject = labelObject;
                        scene.add(node.data.labelObject);
                    }
                });
            } else {
                graph.nodes.forEach((node) => {
                    if (node.data.labelObject !== undefined) {
                        scene.remove(node.data.labelObject);
                        node.data.labelObject = undefined;
                    }
                });
            }

            if (selection) {
                objectSelection.render(scene, camera);
            }

            if (showStats) {
                stats.update();
            }

            renderer.render(scene, camera);
        };

        const printInfo = () => {
            let str = "";
            for (const index in infoText) {
                if (str !== "" && infoText[index] !== "") {
                    str += " - ";
                }
                str += infoText[index];
            }
            document.getElementById("graph-info").innerHTML = str;
        };

        const randomFromTo = (from, to) =>
            Math.floor(Math.random() * (to - from + 1) + from);

        init();
        createGraph();
        animate();

        return () => {
            controls.dispose();
            renderer.dispose();
        };
    }, [
        layout,
        showStats,
        showInfo,
        showLabels,
        selection,
        limit,
        numNodes,
        numEdges,
        graphLayout,
    ]);

    return <div className="w-full h-full" ref={containerRef} />;
};

export default SimpleGraph;
