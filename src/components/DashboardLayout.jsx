import React, { useState, useMemo } from "react";
import DropdownFilter from "./DropdownFilter";

import ExplorationChart from "./charts/ExplorationChart";
import LockEfficiencyBoxplot from "./charts/LockEfficiencyBoxplot";
import CombatEfficiencyChart from "./charts/CombatEfficiencyChart";
import DeathsVsAttemptsHeatmap from "./charts/DeathsVsAttemptsHeatmap";
import MaxComboHistogram from "./charts/MaxComboHistogram";
import QuestsByCategoryChart from "./charts/QuestsByCategoryChart";
import QuestsBySubCategoryChart from "./charts/QuestsBySubCategoryChart";
import EfficiencyScatter from "./charts/EfficiencyScatter";

import rawData from "../data/data.json";
import { filterDataByProfile, fixData } from "../utils/dataTransforms";

const DashboardLayout = () => {
    const arrayData = fixData(Object.values(rawData.__collections__.dungeons));
    const [selectedProfile, setSelectedProfile] = useState("All");

    const profiles = ["All", "0", "1", "2", "3"];

    const filteredData = useMemo(() => {
        return selectedProfile === "All"
            ? arrayData
            : filterDataByProfile(arrayData, selectedProfile);
    }, [selectedProfile]);

    return (
        <div className="p-4 max-w-screen-2xl mx-auto">
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">Player Behavior Dashboard</h1>
                <DropdownFilter
                    label="Profile"
                    options={profiles}
                    value={selectedProfile}
                    onChange={setSelectedProfile}
                />
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <ExplorationChart data={filteredData} />
                <LockEfficiencyBoxplot data={filteredData} />
                <CombatEfficiencyChart data={filteredData} />
                <MaxComboHistogram data={filteredData} />
                <DeathsVsAttemptsHeatmap data={filteredData} />
                <QuestsByCategoryChart data={filteredData} />
                <QuestsBySubCategoryChart data={filteredData} />
                <EfficiencyScatter data={filteredData} metric="CompletedQuests" />
                <EfficiencyScatter data={filteredData} metric="UniqueRoomsEntered" />
                <EfficiencyScatter data={filteredData} metric="EnemiesKilled" />
            </section>
        </div>
    );
};

export default DashboardLayout;
