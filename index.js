
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const data = await d3.json("backup.json");

const users = Object.values(data.__collections__.users);
const sessions = Object.values(data.__collections__.dungeons);

const metrics = sessions.map((d, i) => ({
    index: i,
    value: d.TimeToFinish / d.RoomsEntered,
    playerId: d.PlayerId,
}));

function getSessionsPerPlayer(id) {

    let sessionsPerPlayer = [];
    sessions.forEach((element) => {
        if (element["PlayerId"] == id) {
            sessionsPerPlayer.push(element);
        }
    });

    return sessionsPerPlayer;
}

async function renderPlayer(playerIndex, sessionIndex) {

    // Declare the chart dimensions and margins.
    const width = 500;
    const height = 350;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };

    const xScale = d3.scaleBand()
        .domain(metrics.map(d => d.index))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(metrics, d => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    const user = users[playerIndex];

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    d3.select("#container").html("");
    container.append(svg.node());

    // Bars
    svg.selectAll("rect")
        .data(metrics)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.index))
        .attr("y", d => yScale(d.value))
        .attr("height", d => yScale(0) - yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("fill", "lightgray")
        .attr("data-player-id", d => d.playerId)
    
    d3.selectAll(`rect[data-player-id='${user.PlayerId}']`)
        .attr("fill", "steelblue");

    // X Axis (session index)
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d => `S${d}`))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Y Axis (RoomsEntered / TimeToFinish)
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("fill", "black")
        .attr("x", 5)
        .attr("y", margin.top)
        .attr("text-anchor", "start")
        .text("Seconds per Room");

    const sessionsPerPlayer = getSessionsPerPlayer(user["PlayerId"]);

    d3.select("#nav2").html("");

    d3.select("#nav2")
        .selectAll("button")
        .data(d3.range(sessionsPerPlayer.length))
        .enter()
        .append("button")
        .text(d => `Page ${d + 1}`)
        .on("click", (event, d) => renderPlayer(playerIndex, d));
}

d3.select("#nav")
    .selectAll("button")
    .data(d3.range(15))
    .enter()
    .append("button")
    .text(d => `Page ${d + 1}`)
    .on("click", (event, d) => renderPlayer(d, 0));

renderPlayer(0);