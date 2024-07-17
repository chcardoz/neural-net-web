/**
 * A ForceDirectedGraph component renders a force-directed graph using D3.js library.
 * It takes graph data as input and visualizes it in an SVG element.
 *
 * @component
 * @example
 * const graphData = {
 *   nodes: [{ id: "Node 1", group: 1 }, { id: "Node 2", group: 2 }],
 *   links: [{ source: "Node 1", target: "Node 2", value: 10 }]
 * };
 * <ForceDirectedGraph data={graphData} />
 */

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Value } from "@/lib/Value";
import css from "@/style/graph.module.css";
// import { GraphData, GraphLink, GraphNode } from "@/lib/types";

// Default graph data
type ForceDirectedGraphProps = {
    finalValue: Value | undefined;
};

// Extending the GraphNode to conform to D3's SimulationNodeDatum
interface ExtendedGraphNode extends d3.SimulationNodeDatum {
    // id: string;
    group: number;
    // name: string;
    // op: string;
    // grad: number;
    // backward: () => void;
    value: Value;
}

interface ExtendedGraphLink extends d3.SimulationLinkDatum<ExtendedGraphNode> {
    value: number;
}

interface d3GraphDatum {
    nodes: ExtendedGraphNode[];
    links: d3.SimulationLinkDatum<d3.SimulationNodeDatum>[];
}

const buildGraphData = (finalValue: Value | undefined): d3GraphDatum => {
    if (!finalValue) return { nodes: [], links: [] };

    const nodes: ExtendedGraphNode[] = [];
    const links: ExtendedGraphLink[] = [];

    const traverse = (val: Value, group: number) => {
        nodes.push({
            // id: val.id,
            group: group,
            // name: val.name,
            // op: val.op,
            // grad: val.grad,
            // backward: val.backward,
            value: val,
        });
        if (val.children) {
            val.children.forEach((child) => {
                links.push({
                    source: val.id,
                    target: child.id,
                    value: val.value,
                });
                traverse(child, group + 1);
            });
        }
    };

    traverse(finalValue, 1);
    return { nodes, links };
};

/**
 * ForceDirectedGraph component renders a force-directed graph using D3.js library.
 * @param {Object} props - Component props
 * @param {Object} props.data - Graph data containing nodes and links
 * @returns {JSX.Element} - ForceDirectedGraph component
 */
const ForceDirectedGraph: React.FC<{ finalValue: Value | undefined }> = ({
    finalValue,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [graphData, setGraphData] = useState<d3GraphDatum>({
        nodes: [],
        links: [],
    });

    useEffect(() => {
        setGraphData(buildGraphData(finalValue));
    }, [finalValue]);

    useEffect(() => {
        const width = 928;
        const height = 600;
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const svg = d3
            .select(svgRef.current!)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("style", "width: 100%; height: 100%; color: white");

        svg.selectAll("*").remove(); // Clear previous SVG contents

        // initiliaze simulation
        const simulation = d3
            .forceSimulation(graphData.nodes)
            .force(
                "link",
                d3
                    .forceLink(graphData.links)
                    .id((d: any) => d.value.id)
                    .distance(5)
            )
            .force("charge", d3.forceManyBody().strength(-600))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .on("tick", ticked);

        const link = svg
            .append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(graphData.links)
            .join("line")
            .attr("stroke-width", (d: any) => 0.3 * Math.sqrt(d.value.value));

        const node = svg
            .append("g")
            .attr("stroke", "#000000")
            .attr("stroke-width", 1.5)
            .selectAll("g")
            .data(graphData.nodes)
            .enter()
            .append("g")
            .call(drag(simulation))
            .attr("class", css.node)
            .on("mouseover", function (d) {
                d3.select(this).raise();
                d3.select(this).select(".tooltip").style("display", "block");
                d3.select(this)
                    .select(".tooltip-text")
                    .style("display", "block");
            })
            .on("mouseout", function (d) {
                d3.select(this).select(".tooltip").style("display", "none");
                d3.select(this)
                    .select(".tooltip-text")
                    .style("display", "none");
            })
            .on("dblclick", function (event, d) {
                console.log("====================================");
                d.value.backward();
                console.log("Backward executed");
                console.log("====================================");
            });

        var cicles = node
            .append("circle")
            .attr("r", (d: any) => 20 / d.group)
            .attr("fill", (d: any) => color(d.group));

        // node.append("text")
        //     .text((d: any) => d.name)
        //     .attr("text-anchor", "middle")
        //     .attr("dy", 5)
        //     .attr("fill", "black");

        // Add tooltip
        node.append("rect")
            .attr("class", "tooltip")
            .attr("width", 100)
            .attr("height", 55)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("rx", 10)
            .attr("ry", 10)
            .style("display", "none")
            .attr("x", -50)
            .attr("y", -70);
        // .attr("x", function (d) {
        //     -50;
        // })
        // .attr("y", function (d) {
        //     return d.y! - 70; // Adjust this value to position the tooltip above the node
        // });

        // Add tooltip text
        node.append("text")
            .attr("class", "tooltip-text")
            .attr("text-anchor", "middle")
            .attr("dy", -55)
            .style("font-size", "10px")
            .style("fill", "black")
            .style("display", "none")
            .selectAll("tspan")
            .data((d: any) => {
                return [
                    `Name: ${d.value.name}`,
                    `Op: ${d.value.op}`,
                    `Grad: ${d.value.grad}`,
                ];
            })
            .enter()
            .append("tspan")
            .attr("x", 0)
            .attr("dy", -20) // Adjust as needed for spacing between lines
            .text((text: string) => text);

        function ticked() {
            link.attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node.attr("transform", (d: any) => `translate(${d.x}, ${d.y})`);
        }

        function drag(simulation: any) {
            return function (selection: any) {
                selection.call(
                    d3
                        .drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended)
                );
            };
        }

        function dragstarted(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: any, d: any) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return () => {
            simulation.stop();
        };
    }, [graphData]);

    return (
        <svg
            className="bg-black absolute top-0 left-0 z-10 h-full w-full"
            ref={svgRef}
        ></svg>
    );
};

export default ForceDirectedGraph;

// possible fixes:
//  FIXME : stops at the first binary statement.
// uniform the id system
// TODO: Scrolling feature in graph area
// TODO: Click to center the graph at the center of mass
// FIXME: Investigate the flyign off objects
// TODO: Graph dynamics need to be stable

// use the operation from value in ast
// graph refresh (update) : create a funcntion on a node that uses use's it's children's gradient as input to a checksum function.
