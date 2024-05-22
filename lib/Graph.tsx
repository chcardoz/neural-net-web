import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import data from "@/public/miserables.json";

const graphData = data;

const ForceDirectedGraph = ({ data }: any) => {
	const svgRef = useRef<SVGSVGElement>(null);

	data = graphData;

	console.log("====================================");
	console.log(data);
	console.log("====================================");

	useEffect(() => {
		const width = 928;
		const height = 600;

		const color = d3.scaleOrdinal(d3.schemeCategory10);

		const links = data.links.map((d: any) => ({ ...d }));
		const nodes = data.nodes.map((d: any) => ({ ...d }));

		const simulation = d3
			.forceSimulation(nodes)
			.force(
				"link",
				d3.forceLink(links).id((d: any) => d.id)
			)
			.force("charge", d3.forceManyBody())
			.force("center", d3.forceCenter(width / 2, height / 2))
			.on("tick", ticked);

		const svg = d3
			.select(svgRef.current!)
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", `0 0 ${width} ${height}`)
			.attr("style", "max-width: 100%; height: auto;");

		const link = svg
			.append("g")
			.attr("stroke", "#999")
			.attr("stroke-opacity", 0.6)
			.selectAll("line")
			.data(links)
			.join("line")
			.attr("stroke-width", (d: any) => Math.sqrt(d.value));

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

		node.append("title").text((d: any) => d.id);

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

		return () => {
			simulation.stop();
		};
	}, [data]);

	return <svg ref={svgRef}></svg>;
};

export default ForceDirectedGraph;
