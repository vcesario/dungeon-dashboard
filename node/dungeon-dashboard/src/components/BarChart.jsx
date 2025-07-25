import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function BarChart({ data, playerId, sessionId }) {
  const ref = useRef();

  useEffect(() => {
    const sessions = Object.entries(data).map(([sessId, d]) => ({
      sessId,
      playerId: d.PlayerId,
      roomsPerSecond: d.RoomsEntered / d.TimeToFinish
    }));
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = 600;
    const height = 300;
    const barWidth = width / sessions.length;

    const y = d3.scaleLinear()
      .domain([0, d3.max(sessions, s => s.roomsPerSecond)])
      .range([height, 0]);

    svg
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("rect")
      .data(sessions)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * barWidth)
      .attr("y", d => y(d.roomsPerSecond))
      .attr("width", barWidth - 2)
      .attr("height", d => height - y(d.roomsPerSecond))
      .attr("fill", d => {
        if (d.sessId == sessionId) {
          return "orange";
        }

        if (d.playerId == playerId) {
          return "steelblue";
        }

        return "gray";
      });

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .text("Rooms per second");

  }, [data, playerId, sessionId]);

  return <svg ref={ref}></svg>;
}
