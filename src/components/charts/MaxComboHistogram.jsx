import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const MaxComboHistogram = ({ data }) => {
    const ref = useRef();

    useEffect(() => {
        if (!Array.isArray(data) || data.length === 0) return;

        const margin = { top: 30, right: 30, bottom: 40, left: 50 };
        const width = 400 - margin.left - margin.right;
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

        // Filter and prepare data
        const values = data
            .map(d => d.MaxCombo)
            .filter(v => typeof v === "number" && isFinite(v));

        if (values.length === 0) return;

        const histogram = d3.histogram()
            .value(d => d)
            .domain(d3.extent(values))
            .thresholds(d3.range(
                d3.min(values),
                d3.max(values) + 1,
                1
            ));

        const bins = histogram(values);

        const x = d3.scaleBand()
            .domain(bins.map(d => d.x0))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length) || 1])
            .range([height, 0]);

        // Bars
        chart.selectAll("rect")
            .data(bins)
            .join("rect")
            .attr("x", d => x(d.x0))
            .attr("y", d => y(d.length))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.length))
            .attr("fill", "#4a90e2");

        // Axes
        chart
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        chart.append("g").call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("d")));

        // Title
        svg
            .append("text")
            .attr("x", margin.left)
            .attr("y", 20)
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .text("Max Combo Histogram");
    }, [data]);

    return <div ref={ref} className="w-full h-auto" />;
};

export default MaxComboHistogram;
