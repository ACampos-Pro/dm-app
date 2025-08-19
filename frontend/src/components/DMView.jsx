import React, { useEffect, useState } from 'react';

export default function DMView({ socket, sessionCode }) {
  const [players, setPlayers] = useState({});

  useEffect(() => {
    // Join DM room using correct payload
    socket.emit('joinSession', { sessionCode, playerName: 'DM', isDM: true });

    // Listen for full player list updates
    socket.on('playerList', (playerData) => {
      setPlayers(playerData);
    });

    // Request player list immediately on load
    socket.emit('requestPlayerList', sessionCode);

    return () => {
      socket.off('playerList');
    };
  }, [sessionCode, socket]);

  // Update player stats using correct event name and payload
  const updatePlayerStat = (playerName, stat, value) => {
    // Build the payload for updateStats
    const payload = { sessionCode, target: playerName };
    payload[stat] = value;
    socket.emit('updateStats', payload);
  };

  return (
    <div>
      <h2>Dungeon Master Panel</h2>
      <p>Session Code: {sessionCode}</p>

      <h3>Players</h3>
      {Object.keys(players).length === 0 && <p>No players yet.</p>}
      {Object.entries(players).map(([name, data]) => (
        <div key={name} style={{ border: '1px solid #555', margin: '10px', padding: '10px' }}>
          <h4>{name}</h4>

          {/* Show character info if available */}
          {data.characterData ? (
            <div>
              <p><strong>Alias:</strong> {data.characterData.alias || 'N/A'}</p>
              <p><strong>Role:</strong> {data.characterData.role || 'N/A'}</p>
              <p><strong>Stats:</strong></p>
              <ul>
                <li>Grit: {data.characterData.stats?.grit}</li>
                <li>Reflex: {data.characterData.stats?.reflex}</li>
                <li>Smarts: {data.characterData.stats?.smarts}</li>
                <li>Charm: {data.characterData.stats?.charm}</li>
                <li>Cool: {data.characterData.stats?.cool}</li>
              </ul>
            </div>
          ) : (
            <p>Character not created yet.</p>
          )}

          {/* Stats control */}
          <div>
            <label>HP: </label>
            <input
              type="number"
              defaultValue={data.hp}
              onBlur={(e) => updatePlayerStat(name, 'hp', Number(e.target.value))}
            />
            <label> XP: </label>
            <input
              type="number"
              defaultValue={data.xp}
              onBlur={(e) => updatePlayerStat(name, 'xp', Number(e.target.value))}
            />
            <label> Gold: </label>
            <input
              type="number"
              defaultValue={data.gold}
              onBlur={(e) => updatePlayerStat(name, 'gold', Number(e.target.value))}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
