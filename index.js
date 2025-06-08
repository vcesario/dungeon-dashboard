
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Declare the chart dimensions and margins.
const width = 540;
const height = width;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

const data = await d3.json("backup.json");

const heatmap = Object.values(data.__collections__.dungeons)[0].HeatMap;
console.log(heatmap);

const color = d => {

    let max = Math.max(...heatmap);

    if (d == -1)
    {
        return "none";
    }

    return d3.scaleSequential(d3.interpolateViridis)
        .domain([0, max])(d) // assuming data in range [0, 1]
};

// Create the SVG container.
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height);

const cellSize = 40;
const cols = 6;

svg.selectAll("rect")
    .data(heatmap)
    .enter()
    .append("rect")
    .attr("x", (d, i) => (i % cols) * cellSize)
    .attr("y", (d, i) => Math.floor(i / cols) * cellSize)
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("fill", d => color(d))
    // .attr("stroke", "black")
;

svg.selectAll("text")
    .data(heatmap)
    .enter()
    .append("text")
    .attr("x", (d, i) => (i % cols) * cellSize + cellSize / 2)
    .attr("y", (d, i) => Math.floor(i / cols) * cellSize + cellSize / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black") // you can also use black depending on color
    .text(d => d);

// Append the SVG element.
container.append(svg.node());