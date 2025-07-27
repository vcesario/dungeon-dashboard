export function filterDataByProfile(data, profileEnum) {
  return data.filter(
    (entry) => entry.InputProfile?.PlayerProfileEnum?.toString() == profileEnum
  );
}

export function fixData(data) {
  return data.map(d => {
    d.CompletedQuests = d.CompletedAchievementQuests
      + d.CompletedImmersionQuests
      + d.CompletedMasteryQuests
      + d.CompletedCreativityQuests;
    return d;
  });
}