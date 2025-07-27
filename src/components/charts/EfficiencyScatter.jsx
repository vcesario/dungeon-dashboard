import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const EfficiencyScatter = ({ data, metric }) => {
    const ref = useRef();

    useEffect(() => {
        if (!Array.isArray(data) || data.length === 0) return;

        const margin = { top: 30, right: 30, bottom: 50, left: 60 };
        const width = 450 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3
            .select(ref.current)
            .html("")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const chart = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const points = data
            .filter((d) =>
                d.TimeToFinish >= 0 &&
                d[metric] != null &&
                isFinite(d.TimeToFinish) &&
                isFinite(d[metric])
            )
            .map((d) => ({
                time: d.TimeToFinish,
                value: d[metric],
                profile: d.InputProfile?.PlayerProfileEnum ?? "undefined",
            }));

        const x = d3
            .scaleLinear()
            .domain([0, d3.max(points, (d) => d.time) || 1])
            .nice()
            .range([0, width]);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(points, (d) => d.value) || 1])
            .nice()
            .range([height, 0]);

        const color = d3
            .scaleOrdinal()
            .domain(["0", "1", "2", "3", "undefined"])
            .range(["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6B7280"]);

        chart
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x));
        chart.append("g").call(d3.axisLeft(y));

        chart
            .selectAll("circle")
            .data(points)
            .join("circle")
            .attr("cx", (d) => x(d.time))
            .attr("cy", (d) => y(d.value))
            .attr("r", 4)
            .attr("fill", (d) => color(d.profile))
            .attr("opacity", 0.7);

        const fieldName = metric.replace(/([A-Z])/g, " $1").trim();
        svg
            .append("text")
            .attr("x", margin.left)
            .attr("y", 20)
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .text(`${fieldName} vs Time To Finish`);
    }, [data, metric]);

    return <div ref={ref} className="w-full h-auto" />;
};

export default EfficiencyScatter;