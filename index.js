
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

function getColAmount(arraySize) {
    switch (arraySize) {
        case 15:
            return 3;
        case 18:
            return 6;
        case 20:
            return 4;
        case 24:
            return 6;
        case 25:
            return 5;
        case 28:
            return 4;
        case 30:
            return 3;
        case 32:
            return 8;
        case 35:
            return 7;
        case 36:
            return 6;
        case 42:
            return 7;
        case 48:
            return 8;

        default:
            return 100;
    }
}

async function renderMap(index) {

    // Declare the chart dimensions and margins.
    const width = 500;
    const height = 350;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    const data = await d3.json("backup.json");

    const heatmap = Object.values(data.__collections__.dungeons)[index].HeatMap;
    console.log((index + 1) + " => (" + heatmap.length + ") " + heatmap);

    const color = d => {

        let max = Math.max(...heatmap);

        if (d == -1) {
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
    const colAmount = getColAmount(heatmap.length);

    svg.selectAll("rect")
        .data(heatmap)
        .enter()
        .append("rect")
        .attr("x", (d, i) => (i % colAmount) * cellSize)
        .attr("y", (d, i) => Math.floor(i / colAmount) * cellSize)
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("fill", d => color(d))
        // .attr("stroke", "black")
        ;

    svg.selectAll("text")
        .data(heatmap)
        .enter()
        .append("text")
        .attr("x", (d, i) => (i % colAmount) * cellSize + cellSize / 2)
        .attr("y", (d, i) => Math.floor(i / colAmount) * cellSize + cellSize / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", "12px")
        .attr("fill", "black") // you can also use black depending on color
        .text(d => d);

    // Append the SVG element.
    // const container = d3.select("#container");
    // container.html(svg.node());
    d3.select("#container").html("");
    container.append(svg.node());
}

d3.select("#nav")
    .data(d3.range(120))
    .enter()
    .append("button")
    .text(d => `Page ${d}`)
    .on("click", (event, d) => renderMap(d - 1));
// ("button").on("click", function () {
//     const page = d3.select(this).attr("data-page");
//     console.log(page);
//     renderMap(page);
// });

renderMap(0);