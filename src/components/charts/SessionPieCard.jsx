import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { getProfileLabel } from "../../utils/dataTransforms";

const SessionPieCard = ({ data }) => {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // Clear previous renders

        // === Size and color setup ===
        const width = 160;
        const height = 160;
        const radius = Math.min(width, height) / 2;
        const color = d3.scaleOrdinal(d3.schemeTableau10);

        // === Aggregate profile counts ===
        const profileCounts = d3.rollup(
            data,
            v => v.length,
            d => d.InputProfile?.PlayerProfileEnum ?? "undefined"
        );

        const pieData = Array.from(profileCounts, ([profile, count]) => ({
            profile,
            count
        }));

        const pie = d3.pie().value(d => d.count);
        const arc = d3.arc().innerRadius(0).outerRadius(radius - 10);

        const g = svg
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        g.selectAll("path")
            .data(pie(pieData))
            .join("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.profile))
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5);

        g.selectAll("text")
            .data(pie(pieData))
            .join("text")
            .attr("transform", d => {
                const [x, y] = arc.centroid(d);
                const offset = 2.1; // tweak this value as needed
                return `translate(${x * offset}, ${y * offset})`;
            })
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("fill", "white")
            .attr("font-size", "16px")
            .text(d => {
                const percent = (d.data.count / d3.sum(pieData, d => d.count)) * 100;
                return `${getProfileLabel(d.data.profile)} (${percent.toFixed(1)}%)`;
            });

    }, [data]);

    const label = "Session Distribution";

    return (
        <div className="rounded-xl p-4 h-50 bg-slate-800 grid grid-flow-col grid-rows-3" >
            <div className="text-sm font-medium mb-2 opacity-70 row-span-1">{label}</div>
            <div className="row-span-2 flex items-center justify-center">
                <svg ref={ref} className="w-full h-full" viewBox="0 0 160 160" />
            </div>
        </div>
    );
};

export default SessionPieCard;