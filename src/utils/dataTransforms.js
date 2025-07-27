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

export function getProfileLabel(number) {
  switch (number) {
    case 0:
    case "0":
      return "Mastery";
    case 1:
    case "1":
      return "Immersion";
    case 2:
    case "2":
      return "Creativity";
    case 3:
    case "3":
      return "Achievement";
    default:
      return "undefined";
  }
}