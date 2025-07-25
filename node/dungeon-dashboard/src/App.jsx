import { useEffect, useState } from 'react';
import BarChart from './components/BarChart';
import data from './data.json';

function App() {
  console.clear();

  const allSessions = data.__collections__.dungeons;
  const players = Object.values(data.__collections__.users).sort();

  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0]);

  const playerSessions = Object.fromEntries(
    Object.entries(allSessions).filter(([key, value]) => value.PlayerId == selectedPlayerId)
  );
  const playerSessionKeys = Object.keys(playerSessions).sort();
  const [selectedSessionId, setSelectedSessionId] = useState(playerSessionKeys[0]);

  // console.log(playerSessionKeys);

  useEffect(() => {
  if (playerSessionKeys.length > 0) {
    setSelectedSessionId(playerSessionKeys[0]);
  } else {
    setSelectedSessionId(""); // or some fallback behavior
  }
}, [selectedPlayerId]);

  return (
    <div className="p-4">
      <header>
        <h1>Dungeon Dashboard</h1>
      </header>

      <label className="block">
        Select Player:{" "}
        <select
          value={selectedPlayerId}
          onChange={e => setSelectedPlayerId(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 bg-white text-gray-800 text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {players.map(player => (
            <option key={player.PlayerId} value={player.PlayerId}>
              {player.PlayerId}
            </option>
          ))}
        </select>
      </label>

      <label>
        Select Session:{" "}
        <select
          value={selectedSessionId}
          onChange={e => setSelectedSessionId(e.target.value)}
          className="w-full max-w-xs px-4 py-2 border border-gray-300 bg-white text-gray-800 text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {playerSessionKeys.map(session => (
            <option key={session} value={session}>
              {session}
            </option>
          ))}
        </select>
      </label>

      <nav id="nav2">
      </nav>

      <section id="player-info">
      </section>

      <BarChart data={allSessions} playerId={selectedPlayerId} sessionId={selectedSessionId} />

    </div>
  );
}

export default App;
