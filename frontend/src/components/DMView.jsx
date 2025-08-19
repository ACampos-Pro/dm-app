import React, { useEffect, useState } from 'react';
import PlayerSheet from './PlayerSheet';

export default function DMView({ socket, sessionCode }) {
  const [players, setPlayers] = useState({});
  const [inputs, setInputs] = useState({}); // { [playerId]: { hp: '', xp: '', gold: '' } }

  useEffect(() => {
    socket.on('dm:updatePlayerList', (playerData) => {
      setPlayers(playerData);
    });
    return () => {
      socket.off('dm:updatePlayerList');
    };
  }, [sessionCode, socket]);

  // Handle input changes for each player
  const handleInputChange = (playerId, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], [field]: value }
    }));
  };

  // DM actions
  const handleHpChange = (player, sign) => {
    const val = parseInt(inputs[player.id]?.hp, 10);
    if (!isNaN(val) && val !== 0) {
      socket.emit('dm:dealDamage', { targetPlayerId: player.id, amount: sign === '+' ? -val : val });
      setInputs((prev) => ({ ...prev, [player.id]: { ...prev[player.id], hp: '' } }));
    }
  };
  const handleXpChange = (player, sign) => {
    const val = parseInt(inputs[player.id]?.xp, 10);
    if (!isNaN(val) && val !== 0) {
      socket.emit('updateStats', { sessionCode, target: player.id, xp: (player.xp || 0) + (sign === '+' ? val : -val) });
      setInputs((prev) => ({ ...prev, [player.id]: { ...prev[player.id], xp: '' } }));
    }
  };
  const handleGoldChange = (player, sign) => {
    const val = parseInt(inputs[player.id]?.gold, 10);
    if (!isNaN(val) && val !== 0) {
      socket.emit('dm:giveGold', { targetPlayerId: player.id, amount: sign === '+' ? val : -val });
      setInputs((prev) => ({ ...prev, [player.id]: { ...prev[player.id], gold: '' } }));
    }
  };

  return (
    <div className="view">
      <h2>Dungeon Master Panel</h2>
      <p>Session Code: {sessionCode}</p>
      <h3>Players</h3>
      {Object.keys(players).length === 0 && <p>No players yet.</p>}
      {Object.values(players).map((player) => (
        <div key={player.id} className="player-card" style={{ marginBottom: '2rem' }}>
          <PlayerSheet player={player} />
          <div className="dm-actions" style={{ marginTop: '1rem' }}>
            <div className="dm-action-group">
              <input
                type="number"
                placeholder="HP"
                value={inputs[player.id]?.hp || ''}
                onChange={(e) => handleInputChange(player.id, 'hp', e.target.value)}
                style={{ width: 80 }}
              />
              <button onClick={() => handleHpChange(player, '-')}>Take HP</button>
              <button onClick={() => handleHpChange(player, '+')}>Give HP</button>
            </div>
            <div className="dm-action-group">
              <input
                type="number"
                placeholder="XP"
                value={inputs[player.id]?.xp || ''}
                onChange={(e) => handleInputChange(player.id, 'xp', e.target.value)}
                style={{ width: 80 }}
              />
              <button onClick={() => handleXpChange(player, '-')}>Take XP</button>
              <button onClick={() => handleXpChange(player, '+')}>Give XP</button>
            </div>
            <div className="dm-action-group">
              <input
                type="number"
                placeholder="Gold"
                value={inputs[player.id]?.gold || ''}
                onChange={(e) => handleInputChange(player.id, 'gold', e.target.value)}
                style={{ width: 80 }}
              />
              <button onClick={() => handleGoldChange(player, '-')}>Take Gold</button>
              <button onClick={() => handleGoldChange(player, '+')}>Give Gold</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
