import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getProfileLabel } from "../../utils/dataTransforms";

const QuestsByCategoryChart = ({ data }) => {
    const ref = useRef();
    const CATEGORIES = ["Immersion", "Achievement", "Mastery", "Creativity"];
    const COLORS = d3
        .scaleOrdinal()
        .domain(CATEGORIES)
        .range(["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"]);

    useEffect(() => {
        if (!Array.isArray(data) || data.length === 0) return;

        const margin = { top: 30, right: 20, bottom: 40, left: 50 };
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

        const grouped = d3.group(data, (d) =>
            d.InputProfile?.PlayerProfileEnum ?? "undefined"
        );

        const stackedData = Array.from(grouped, ([profile, entries]) => {
            const sums = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
            entries.forEach((d) => {
                CATEGORIES.forEach((c) => {
                    sums[c] += d["Completed" + c + "Quests"];
                });
            });
            return { profile, ...sums };
        });

        const stack = d3.stack().keys(CATEGORIES);
        const series = stack(stackedData);

        const x = d3
            .scaleBand()
            .domain(stackedData.map((d) => d.profile))
            .range([0, width])
            .padding(0.3);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(stackedData, (d) => CATEGORIES.reduce((a, k) => a + d[k], 0)) || 1])
            .nice()
            .range([height, 0]);

        chart
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat((d) => getProfileLabel(d)));

        chart.append("g").call(d3.axisLeft(y));

        chart
            .selectAll("g.layer")
            .data(series)
            .join("g")
            .attr("fill", (d) => COLORS(d.key))
            .selectAll("rect")
            .data((d) => d)
            .join("rect")
            .attr("x", (d) => x(d.data.profile))
            .attr("y", (d) => y(d[1]))
            .attr("height", (d) => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth());

        svg
            .append("text")
            .attr("x", margin.left)
            .attr("y", 20)
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .attr("opacity", "70%")
            .text("Quest Completion (Category)");

        const legend = svg
            .append("g")
            .attr("transform", `translate(${width + margin.left - 10}, ${margin.top})`);

        CATEGORIES.forEach((category, i) => {
            legend.append("rect")
                .attr("x", 0)
                .attr("y", i * 20)
                .attr("width", 12)
                .attr("height", 12)
                .attr("fill", COLORS(category));

            legend.append("text")
                .attr("x", 16)
                .attr("y", i * 20 + 10)
                .attr("font-size", "12px")
                .attr("fill", "white")
                .text(category[0]);
        });
    }, [data]);

    return <div ref={ref} className="w-full h-auto" />;
};

export default QuestsByCategoryChart;