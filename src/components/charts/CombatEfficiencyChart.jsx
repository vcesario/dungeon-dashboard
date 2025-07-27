import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const CombatEfficiencyChart = ({ data }) => {
  const ref = useRef();

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

    // Group data by profile
    const grouped = d3.group(data, (d) =>
      d.InputProfile?.PlayerProfileEnum ?? "undefined"
    );

    // Compute totals per profile
    const barData = Array.from(grouped, ([profile, entries]) => {
      let killed = 0;
      let total = 0;

      entries.forEach((d) => {
        if (d.TotalEnemies && d.EnemiesKilled >= 0) {
          killed += d.EnemiesKilled;
          total += d.TotalEnemies;
        }
      });

      return {
        profile,
        killed,
        left: Math.max(total - killed, 0),
        total,
      };
    });

    // Stacked keys
    const keys = ["killed", "left"];

    // Color scale
    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["#10B981", "#F87171"]); // green for killed, red for left

    // Scales
    const x = d3
      .scaleBand()
      .domain(barData.map((d) => d.profile))
      .range([0, width])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(barData, (d) => d.total) || 10])
      .nice()
      .range([height, 0]);

    // Axes
    chart
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    chart.append("g").call(d3.axisLeft(y));

    // Stack generator
    const stack = d3.stack().keys(keys);

    const stackedData = stack(barData);

    // Draw bars
    chart
      .selectAll("g.layer")
      .data(stackedData)
      .join("g")
      .attr("class", "layer")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => x(d.data.profile))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());

    // Add total labels
    chart
      .selectAll("text.label")
      .data(barData)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.profile) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.total) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("fill", "white")
      .text((d) => d.total);

    // Title
    svg
      .append("text")
      .attr("x", margin.left)
      .attr("y", 20)
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .text("Enemies Killed vs Left (Raw Counts)");
  }, [data]);

  return <div ref={ref} className="w-full h-auto" />;
};

export default CombatEfficiencyChart;
