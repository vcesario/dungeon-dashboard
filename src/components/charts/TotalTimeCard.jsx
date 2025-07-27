import React from "react";

const TotalTimeCard = ({ data }) => {
  function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);

    return parts.join(' ');
  }


  const rawSum = data.reduce((sum, d) => {
    return sum + d.TimeToFinish;
  }, 0);
  const value = formatDuration(Math.trunc(rawSum));
  const label = "Total Time Played";

  return (
    <div
      className="rounded-xl p-4 h-50 bg-sky-800 grid grid-flow-col grid-rows-3"
    >
      <div className="text-sm font-medium mb-2 opacity-70 row-span-1">{label}</div>
      <div className="row-span-2 flex justify-center text-6xl font-bold text-center">{value}</div>
    </div>
  );
};

export default TotalTimeCard;