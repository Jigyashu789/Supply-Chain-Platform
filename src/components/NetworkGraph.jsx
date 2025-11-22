import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NetworkGraph = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!data || !data.nodes || !data.lanes) return;

        const width = 800;
        const height = 600;

        // Clear previous render
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", "100%")
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; background: rgba(15, 23, 42, 0.3); border-radius: 16px;");

        // Simulation setup
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.lanes).id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));

        // Draw links
        const link = svg.append("g")
            .attr("stroke", "#94a3b8")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(data.lanes)
            .join("line")
            .attr("stroke-width", d => Math.sqrt(d.value || 1) * 2);

        // Draw nodes
        const node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(data.nodes)
            .join("circle")
            .attr("r", 10)
            .attr("fill", d => {
                if (d.type === 'supplier') return '#10b981';
                if (d.type === 'plant') return '#3b82f6';
                if (d.type === 'warehouse') return '#f59e0b';
                return '#6366f1';
            })
            .call(drag(simulation));

        // Add labels
        const label = svg.append("g")
            .selectAll("text")
            .data(data.nodes)
            .join("text")
            .text(d => d.name)
            .attr("font-size", "10px")
            .attr("fill", "#e2e8f0")
            .attr("dx", 12)
            .attr("dy", 4);

        // Update positions on tick
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            label
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });

        // Drag behavior
        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default NetworkGraph;
