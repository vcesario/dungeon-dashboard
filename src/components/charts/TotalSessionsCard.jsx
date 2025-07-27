import React from "react";

const TotalSessionsCard = ({ data }) => {
    const value = Object.entries(data).length;
    const label = "Total Sessions";

  return (
    <div
      className="rounded-xl p-4 h-50 bg-slate-800 grid grid-flow-col grid-rows-3"
    >
      <div className="text-sm font-medium mb-2 opacity-70 row-span-1">{label}</div>
      <div className="text-7xl font-bold text-center row-span-2 flex justify-center">{value}</div>
    </div>
  );
};

export default TotalSessionsCard;