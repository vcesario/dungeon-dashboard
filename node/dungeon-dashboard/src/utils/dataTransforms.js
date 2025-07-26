export function filterDataByProfile(data, profileEnum) {
  return data.filter(
    (entry) => entry.InputProfile?.PlayerProfileEnum?.toString() == profileEnum
  );
}