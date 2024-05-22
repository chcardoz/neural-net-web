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

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import data from "@/public/miserables.json";

// Default graph data
const graphData = data;

/**
 * ForceDirectedGraph component renders a force-directed graph using D3.js library.
 * @param {Object} props - Component props
 * @param {Object} props.data - Graph data containing nodes and links
 * @returns {JSX.Element} - ForceDirectedGraph component
 */
const ForceDirectedGraph = ({ data }: any) => {
	// Reference to SVG element
	const svgRef = useRef<SVGSVGElement>(null);

	// Initialize with default or provided data
	data = graphData;

	// Log graph data to console
	console.log("====================================");
	console.log(data);
	console.log("====================================");

	// Effect hook for D3.js initialization
	useEffect(() => {
		const width = 928; // SVG width
		const height = 600; // SVG height

		// D3 color scale
		const color = d3.scaleOrdinal(d3.schemeCategory10);

		// Extract links and nodes from data
		const links = data.links.map((d: any) => ({ ...d }));
		const nodes = data.nodes.map((d: any) => ({ ...d }));

		// Initialize D3 force simulation
		const simulation = d3
			.forceSimulation(nodes)
			.force(
				"link",
				d3.forceLink(links).id((d: any) => d.id)
			)
			.force("charge", d3.forceManyBody())
			.force("center", d3.forceCenter(width / 2, height / 2))
			.on("tick", ticked);

		// Create SVG element
		const svg = d3
			.select(svgRef.current!)
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", `0 0 ${width} ${height}`)
			.attr("style", "max-width: 100%; height: auto;");

		// Create links
		const link = svg
			.append("g")
			.attr("stroke", "#999")
			.attr("stroke-opacity", 0.6)
			.selectAll("line")
			.data(links)
			.join("line")
			.attr("stroke-width", (d: any) => Math.sqrt(d.value));

		// Create nodes
		const node = svg
			.append("g")
			.attr("stroke", "#fff")
			.attr("stroke-width", 1.5)
			.selectAll("circle")
			.data(nodes)
			.join("circle")
			.attr("r", 5)
			.attr("fill", (d: any) => color(d.group))
			.call(drag(simulation));

		// Add title to nodes
		node.append("title").text((d: any) => d.id);

		// Update link and node positions
		function ticked() {
			link
				.attr("x1", (d: any) => d.source.x)
				.attr("y1", (d: any) => d.source.y)
				.attr("x2", (d: any) => d.target.x)
				.attr("y2", (d: any) => d.target.y);

			node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
		}

		// Function for drag behavior
		function drag(simulation: any) {
			return function (selection: any) {
				selection.call(
					d3
						.drag()
						.on("start", (event: any, d: any) => {
							if (!event.active) simulation.alphaTarget(0.3).restart();
							d.fx = d.x;
							d.fy = d.y;
						})
						.on("drag", (event: any, d: any) => {
							d.fx = event.x;
							d.fy = event.y;
						})
						.on("end", (event: any, d: any) => {
							if (!event.active) simulation.alphaTarget(0);
							d.fx = null;
							d.fy = null;
						})
				);
			};
		}

		// Cleanup function
		return () => {
			simulation.stop();
		};
	}, [data]);

	// Render SVG element
	return <svg ref={svgRef}></svg>;
};

export default ForceDirectedGraph;
