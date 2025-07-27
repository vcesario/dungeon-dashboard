import React, { useState, useMemo } from "react";
import DropdownFilter from "./DropdownFilter";

import TotalSessionsCard from "./charts/TotalSessionsCard";
import TotalTimeCard from "./charts/TotalTimeCard";
import UniquePlayersCard from "./charts/UniquePlayersCard";
import SessionPieCard from "./charts/SessionPieCard";

import ExplorationChart from "./charts/ExplorationChart";
import LockEfficiencyBoxplot from "./charts/LockEfficiencyBoxplot";
import CombatEfficiencyChart from "./charts/CombatEfficiencyChart";
import DeathsVsAttemptsHeatmap from "./charts/DeathsVsAttemptsHeatmap";
import MaxComboHistogram from "./charts/MaxComboHistogram";
import QuestsByCategoryChart from "./charts/QuestsByCategoryChart";
import QuestsBySubCategoryChart from "./charts/QuestsBySubCategoryChart";
import EfficiencyScatter from "./charts/EfficiencyScatter";

import rawData from "../data/data.json";
import { filterDataByProfile, fixData, getProfileLabel } from "../utils/dataTransforms";

const DashboardLayout = () => {
    const arrayData = fixData(Object.values(rawData.__collections__.dungeons));

    const [selectedProfiles, setSelectedProfiles] = useState(["0", "1", "2", "3"]);

    const allProfiles = ["0", "1", "2", "3"];

    const toggleProfile = (profile) => {
        setSelectedProfiles((prev) =>
            prev.includes(profile)
                ? prev.filter((p) => p !== profile)
                : [...prev, profile]
        );
    };

    const selectAll = () => setSelectedProfiles(allProfiles);
    const selectNone = () => setSelectedProfiles([]);

    const filteredData = useMemo(() => {
        return arrayData.filter((entry) =>
            selectedProfiles.includes(entry?.InputProfile?.PlayerProfileEnum?.toString())
        );
    }, [selectedProfiles]);

    return (
        <div className="ax-w-screen-2xl mx-auto">
            <header className="mb-6">
                <h2 className="text-3xl font-bold">Player Behavior Dashboard</h2>

                <div className="flex gap-4 items-center flex-wrap mt-4">

                    <button
                        onClick={selectAll}
                        className="px-2 py-1 text-sm bg-gray-400 text-white rounded"
                    >
                        All
                    </button>

                    <button
                        onClick={selectNone}
                        className="px-2 py-1 text-sm bg-gray-400 text-white rounded"
                    >
                        None
                    </button>
                    {allProfiles.map((profile) => (
                        <label key={profile} className="flex items-center gap-1 text-sm">
                            <input
                                type="checkbox"
                                checked={selectedProfiles.includes(profile)}
                                onChange={() => toggleProfile(profile)}
                            />
                            {getProfileLabel(profile)}
                        </label>
                    ))}
                </div>

            </header>

            <section>
                <h3 className="font-bold mb-2">General</h3>
                <div className="columns-4 mb-4">
                    <UniquePlayersCard data={filteredData} />
                    <TotalTimeCard data={filteredData} />
                    <TotalSessionsCard data={filteredData} />
                    <SessionPieCard data={filteredData} />
                </div>
            </section>

            <section className="flex gap-4">
                <div className="flex flex-col flex-1">
                    <div className="text-sm font-bold mb-2">
                        Exploration Performance
                    </div>
                    <div className="flex flex-col gap-4 bg-slate-800 rounded-2xl p-4 flex-1">
                        <ExplorationChart data={filteredData} />
                        <LockEfficiencyBoxplot data={filteredData} />
                        <EfficiencyScatter data={filteredData} metric="UniqueRoomsEntered" />
                    </div>
                </div>

                <div className="flex flex-col flex-1">
                    <div className="text-sm font-bold mb-2">
                        Combat Performance
                    </div>

                    <div className="flex flex-col gap-4 bg-slate-800 rounded-2xl p-4 flex-1">
                        <CombatEfficiencyChart data={filteredData} />
                        <DeathsVsAttemptsHeatmap data={filteredData} />
                        {/* <MaxComboHistogram data={filteredData} /> */}
                        <EfficiencyScatter data={filteredData} metric="EnemiesKilled" />
                    </div>
                </div>

                <div className="flex flex-col flex-1">
                    <div className="text-sm font-bold mb-2">
                        Quest Performance
                    </div>
                    <div className="flex flex-col gap-4 bg-slate-800 rounded-2xl p-4 flex-1">
                        <QuestsByCategoryChart data={filteredData} />
                        <QuestsBySubCategoryChart data={filteredData} />
                        <EfficiencyScatter data={filteredData} metric="CompletedQuests" />
                    </div>
                </div>

            </section>
        </div>
    );
};

export default DashboardLayout;
