import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const QuestsBySubCategoryChart = ({ data }) => {
    const ref = useRef();

    const SUBCATEGORIES = [
        "Explore", "Give", "Report", "Read", "Damage",
        "Exchange", "Kill", "Gather", "GoTo", "Listen"
    ];

    const COLORS = d3
        .scaleOrdinal()
        .domain(SUBCATEGORIES)
        .range(d3.schemeSet3);

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

        const chartData = [];

        for (const [profile, entries] of grouped) {
            const sums = Object.fromEntries(SUBCATEGORIES.map((s) => [s, 0]));
            entries.forEach((d) => {
                SUBCATEGORIES.forEach((s) => {
                    sums[s] += d["Completed" + s + "Quests"];
                });
            });

            for (const subcat of SUBCATEGORIES) {
                chartData.push({
                    profile,
                    subcat,
                    count: sums[subcat],
                });
            }
        }

        const x0 = d3
            .scaleBand()
            .domain([...new Set(chartData.map((d) => d.profile))])
            .range([0, width])
            .padding(0.2);

        const x1 = d3
            .scaleBand()
            .domain(SUBCATEGORIES)
            .range([0, x0.bandwidth()])
            .padding(0.05);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(chartData, (d) => d.count) || 1])
            .nice()
            .range([height, 0]);

        chart
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0));

        chart.append("g").call(d3.axisLeft(y));

        chart
            .selectAll("g.profile")
            .data(d3.group(chartData, (d) => d.profile))
            .join("g")
            .attr("class", "profile")
            .attr("transform", ([profile]) => `translate(${x0(profile)},0)`)
            .selectAll("rect")
            .data(([, values]) => values)
            .join("rect")
            .attr("x", (d) => x1(d.subcat))
            .attr("y", (d) => y(d.count))
            .attr("width", x1.bandwidth())
            .attr("height", (d) => height - y(d.count))
            .attr("fill", (d) => COLORS(d.subcat));

        svg
            .append("text")
            .attr("x", margin.left)
            .attr("y", 20)
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .text("Completed Quests per Subcategory");
    }, [data]);

    return <div ref={ref} className="w-full h-auto" />;
};

export default QuestsBySubCategoryChart;
