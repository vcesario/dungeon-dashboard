import React from "react";

const UniquePlayersCard = ({ data }) => {
  const set = new Set();
  data.forEach((d) => set.add(d.PlayerId));
  const value = set.size;
  const label = "Unique Players";

  return (
    <div
      className="rounded-xl p-4 h-50 bg-slate-800 grid grid-flow-col grid-rows-3"
    >
      <div className="text-sm font-medium mb-2 opacity-70 row-span-1">{label}</div>
      <div className="row-span-2 flex justify-center text-7xl font-bold text-center">{value}</div>
    </div>
  );
};

export default UniquePlayersCard;