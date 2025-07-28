import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getProfileLabel } from "../../utils/dataTransforms";

const LockEfficiencyBoxplot = ({ data }) => {
    const ref = useRef();

    useEffect(() => {
        if (!Array.isArray(data) || data.length === 0) return;

        const margin = { top: 30, right: 20, bottom: 40, left: 40 };
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

        const ratiosByProfile = d3.group(data, (d) =>
            d.InputProfile?.PlayerProfileEnum ?? "undefined"
        );

        const boxData = Array.from(ratiosByProfile, ([profile, entries]) => {
            const values = entries
                .map((d) =>
                    d.TotalLocks && d.LocksOpened >= 0
                        ? d.LocksOpened / d.TotalLocks
                        : null
                )
                .filter((v) => v !== null && isFinite(v) && v >= 0 && v <= 1);

            if (!values.length) return null;

            const sorted = values.sort(d3.ascending);
            return {
                profile,
                q1: d3.quantile(sorted, 0.25),
                median: d3.quantile(sorted, 0.5),
                q3: d3.quantile(sorted, 0.75),
                min: d3.min(sorted),
                max: d3.max(sorted),
            };
        }).filter(Boolean);

        const x = d3
            .scaleBand()
            .domain(boxData.map((d) => d.profile))
            .range([0, width])
            .padding(0.4);

        const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);

        chart
            .append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat((d) => getProfileLabel(d)));

        chart.append("g").call(d3.axisLeft(y).ticks(5));

        // Boxplots
        chart
            .selectAll("g.box")
            .data(boxData)
            .join("g")
            .attr("class", "box")
            .attr("transform", (d) => `translate(${x(d.profile)},0)`)

            .each(function (d) {
                const g = d3.select(this);
                const boxWidth = x.bandwidth();

                g.append("rect")
                    .attr("y", y(d.q3))
                    .attr("height", y(d.q1) - y(d.q3))
                    .attr("width", boxWidth)
                    .attr("fill", "#FBBF24");

                g.append("line")
                    .attr("x1", 0)
                    .attr("x2", boxWidth)
                    .attr("y1", y(d.median))
                    .attr("y2", y(d.median))
                    .attr("stroke", "#92400E")
                    .attr("stroke-width", 2);

                g.append("line")
                    .attr("x1", boxWidth / 2)
                    .attr("x2", boxWidth / 2)
                    .attr("y1", y(d.min))
                    .attr("y2", y(d.q1))
                    .attr("stroke", "#78350F");

                g.append("line")
                    .attr("x1", boxWidth / 2)
                    .attr("x2", boxWidth / 2)
                    .attr("y1", y(d.q3))
                    .attr("y2", y(d.max))
                    .attr("stroke", "#78350F");
            });

        svg
            .append("text")
            .attr("x", margin.left)
            .attr("y", 20)
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("fill", "white")
            .attr("opacity", "70%")
            .text("Lock opening efficiency");

        svg
            .append("text")
            .attr("transform", `rotate(-90)`)
            .attr("x", -margin.top - height / 2)
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "white")
            .attr("opacity", "70%")
            .text("Ratio - Opened Locks over Total Locks");
    }, [data]);

    return <div ref={ref} className="w-full h-auto" />;
};

export default LockEfficiencyBoxplot;