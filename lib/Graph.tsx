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
import { GraphData, GraphLink, GraphNode } from "@/lib/types";

// Default graph data
type ForceDirectedGraphProps = {
	finalValue: Value | undefined;
};

// Extending the GraphNode to conform to D3's SimulationNodeDatum
interface ExtendedGraphNode extends d3.SimulationNodeDatum {
	id: string;
	group: number;
}

interface ExtendedGraphLink extends d3.SimulationLinkDatum<ExtendedGraphNode> {
	value: number;
}

interface d3GraphDatum {
	nodes: d3.SimulationNodeDatum[];
	links: d3.SimulationLinkDatum<d3.SimulationNodeDatum>[];
}

const buildGraphData = (finalValue: Value | undefined): d3GraphDatum => {
	if (!finalValue) return { nodes: [], links: [] };

	const nodes: ExtendedGraphNode[] = [];
	const links: ExtendedGraphLink[] = [];

	const traverse = (val: Value, group: number) => {
		nodes.push({ id: val.name, group });
		if (val.children) {
			val.children.forEach((child) => {
				links.push({ source: val.name, target: child.name, value: 1 });
				traverse(child, group + 1);
			});
		}
	};

	traverse(finalValue, 1);
	console.log(nodes, links);
	return { nodes, links };
};

/**
 * ForceDirectedGraph component renders a force-directed graph using D3.js library.
 * @param {Object} props - Component props
 * @param {Object} props.data - Graph data containing nodes and links
 * @returns {JSX.Element} - ForceDirectedGraph component
 */
const ForceDirectedGraph: React.FC<{ finalValue: Value | undefined }> = ({
	finalValue
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const [graphData, setGraphData] = useState<d3GraphDatum>({
		nodes: [],
		links: []
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
			.attr("style", "width: 100%; height: 100%;");

		svg.selectAll("*").remove(); // Clear previous SVG contents

		// initiliaze simulation
		const simulation = d3
			.forceSimulation(graphData.nodes)
			.force(
				"link",
				d3
					.forceLink(graphData.links)
					.id((d: any) => d.id)
					.distance(100)
			)
			.force("charge", d3.forceManyBody().strength(-350))
			.force("center", d3.forceCenter(width / 2, height / 2))
			.on("tick", ticked);

		const link = svg
			.append("g")
			.attr("stroke", "#999")
			.attr("stroke-opacity", 0.6)
			.selectAll("line")
			.data(graphData.links)
			.join("line")
			.attr("stroke-width", (d: any) => Math.sqrt(d.value));

		// Create nodes
		const node = svg
			.append("g")
			.attr("stroke", "#fff")
			.attr("stroke-width", 1.5)
			.selectAll("circle")
			.data(graphData.nodes)
			.join("circle")
			.attr("r", (d: any) => 50 / d.group)
			.attr("fill", (d: any) => color(d.group))
			.call(drag(simulation))
			.text((d: any) => d.id);

		function ticked() {
			link
				.attr("x1", (d: any) => d.source.x)
				.attr("y1", (d: any) => d.source.y)
				.attr("x2", (d: any) => d.target.x)
				.attr("y2", (d: any) => d.target.y);

			node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
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

	return <svg ref={svgRef}></svg>;
};

export default ForceDirectedGraph;

// possible fixes:
//  FIXME : stops at the first binary statement.
// TODO :  prettify the code
// uniform the id system
// add text to circle
