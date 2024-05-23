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
import data from "@/public/miserables.json";
import { Value } from "@/lib/Value";
import { GraphData, GraphLink, GraphNode } from "@/lib/types";

// Default graph data
const graphData = data;
type ForceDirectedGraphProps = {
	finalValue: Value | undefined;
};

const buildGraphData = (finalValue: Value | undefined): GraphData => {
	if (!finalValue) return { nodes: [], links: [] };

	const nodes: GraphNode[] = [];
	const links: GraphLink[] = [];

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
const ForceDirectedGraph: React.FC<{ finalValue: any }> = ({ finalValue }) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const [graphData, setGraphData] = useState<GraphData>({
		nodes: [],
		links: []
	});

	useEffect(() => {
		const data = buildGraphData(finalValue);
		setGraphData(data);
	}, [finalValue]);

	useEffect(() => {
		const width = 928;
		const height = 600;
		const color = d3.scaleOrdinal(d3.schemeCategory10);

		const svg = d3
			.select(svgRef.current)
			.attr("viewBox", `0 0 ${width} ${height}`)
			.attr("style", "width: 100%; height: 100%;");

		svg.selectAll("*").remove(); // Clear previous SVG contents

		const linkGroup = svg
			.append("g")
			.attr("class", "links")
			.attr("stroke", "#999")
			.attr("stroke-opacity", 0.6);
		const nodeGroup = svg
			.append("g")
			.attr("class", "nodes")
			.attr("stroke", "#000")
			.attr("stroke-width", 1.5);

		const simulation = d3
			.forceSimulation()
			.force(
				"link",
				d3
					.forceLink()
					.id((d: any) => d.id)
					.distance(100)
			)
			.force("center", d3.forceCenter(width / 2, height / 2))
			.force("charge", d3.forceManyBody().strength(-200));

		const drag = (simulation: d3.Simulation<any, any>) => {
			const dragstarted = (
				event: d3.D3DragEvent<SVGCircleElement, any, any>,
				d: any
			) => {
				if (!event.active) simulation.alphaTarget(0.3).restart();
				d.fx = d.x;
				d.fy = d.y;
			};

			const dragged = (
				event: d3.D3DragEvent<SVGCircleElement, any, any>,
				d: any
			) => {
				d.fx = event.x;
				d.fy = event.y;
			};

			const dragended = (
				event: d3.D3DragEvent<SVGCircleElement, any, any>,
				d: any
			) => {
				if (!event.active) simulation.alphaTarget(0);
				d.fx = null;
				d.fy = null;
			};

			return d3
				.drag<SVGCircleElement, any>()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended);
		};

		const updateGraph = (nodes: any[], links: any[]) => {
			const link = linkGroup
				.selectAll<SVGLineElement, any>("line")
				.data(links, (d: any) => `${d.source.id}-${d.target.id}`)
				.join(
					(enter) =>
						enter
							.append("line")
							.attr("stroke-width", (d: any) => Math.sqrt(d.value)),
					(update) => update,
					(exit) => exit.remove()
				);

			const node = nodeGroup
				.selectAll<SVGCircleElement, any>("circle")
				.data(nodes, (d: any) => d.id)
				.join(
					(enter) =>
						enter
							.append("circle")
							.attr("r", 5)
							.attr("fill", (d: any) => color(d.group))
							.call(drag(simulation))
							.append("title")
							.text((d: any) => d.id),
					(update) => update,
					(exit) => exit.remove()
				);

			simulation.nodes(nodes).on("tick", () => {
				link
					.attr("x1", (d: any) => d.source.x)
					.attr("y1", (d: any) => d.source.y)
					.attr("x2", (d: any) => d.target.x)
					.attr("y2", (d: any) => d.target.y);

				node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
			});

			nodes.forEach((node) => {
				node.x = (Math.random() * width) / 2;
				node.y = (Math.random() * height) / 2;
			});

			const forceLink = simulation.force<d3.ForceLink<any, any>>("link");
			if (forceLink) {
				forceLink.links(links);
			}

			simulation.alpha(1).restart();
		};

		if (graphData.nodes.length && graphData.links.length) {
			updateGraph(graphData.nodes, graphData.links);
		}

		return () => {
			simulation.stop();
			svg.selectAll("*").remove();
		};
	}, [graphData]);

	return <svg ref={svgRef}></svg>;
};

export default ForceDirectedGraph;

// possible fixes:
