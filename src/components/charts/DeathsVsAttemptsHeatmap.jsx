import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DeathsVsAttemptsHeatmap = ({ data }) => {
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

        // Clean & group data: (attempts, deaths) -> count
        const filtered = data.filter(
            (d) =>
                d.TotalAttempts >= 0 &&
                d.TotalDeaths >= 0 &&
                isFinite(d.TotalAttempts) &&
                isFinite(d.TotalDeaths)
        );

        const binMap = d3.rollup(
            filtered,
            v => v.length,
            d => d.TotalAttempts,
            d => d.TotalDeaths
        );

        const attemptsSet = new Set();
        const deathsSet = new Set();
        for (const [a, inner] of binMap.entries()) {
            attemptsSet.add(a);
            for (const d of inner.keys()) deathsSet.add(d);
        }

        const attempts = Array.from(attemptsSet).sort((a, b) => a - b);
        const deaths = Array.from(deathsSet).sort((a, b) => a - b);

        // Scales
        const x = d3.scaleBand().domain(attempts).range([0, width]).padding(0.05);
        const y = d3.scaleBand().domain(deaths).range([height, 0]).padding(0.05);

        const maxCount = d3.max(Array.from(binMap.values(), m => d3.max(m.values())));
        const color = d3.scaleSequential(d3.interpolateOranges).domain([0, maxCount || 1]);

        // Axes
        chart.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        chart.append("g").call(d3.axisLeft(y).tickFormat(d3.format("d")));

        // Cells
        for (const [a, deathsMap] of binMap.entries()) {
            for (const [d, count] of deathsMap.entries()) {
                chart.append("rect")
                    .attr("x", x(a))
                    .attr("y", y(d))
                    .attr("width", x.bandwidth())
                    .attr("height", y.bandwidth())
                    .attr("fill", color(count));
            }
        }

        // Title
        svg
            .append("text")
            .attr("x", margin.left)
            .attr("y", 20)
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .text("Deaths vs Attempts (heatmap)");

        // Legend
        const legendWidth = 100;
        const legendHeight = 10;
        // const legendX = width + margin.left + 10;
        const legendX = width - margin.right;
        const legendY = 10;

        const legendScale = d3.scaleLinear()
            .domain([0, maxCount || 1])
            .range([0, legendWidth]);

        const legendAxis = d3.axisBottom(legendScale)
            .ticks(5)
            .tickFormat(d3.format("d"));

        const legendGroup = svg.append("g").attr("transform", `translate(${legendX}, ${legendY})`);

        const legendGradientId = "heatmap-gradient";

        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", legendGradientId)
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%");

        const steps = 10;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            gradient.append("stop")
                .attr("offset", `${t * 100}%`)
                .attr("stop-color", color(t * maxCount));
        }

        legendGroup.append("rect")
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", `url(#${legendGradientId})`);

        legendGroup.append("g")
            .attr("transform", `translate(0, ${legendHeight})`)
            .call(legendAxis)
            .selectAll("text")
            .attr("font-size", "10px");

    }, [data]);

    return <div ref={ref} className="w-full h-auto" />;
};

export default DeathsVsAttemptsHeatmap;