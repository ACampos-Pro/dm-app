import React, { useState, useEffect } from 'react';

export default function PlayerView({ socket, sessionCode, playerName, characterData }) {
  const [hp, setHp] = useState(0);
  const [xp, setXp] = useState(0);
  const [gold, setGold] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [log, setLog] = useState([]);

  // Listen for DM updates
  useEffect(() => {
    socket.on('updateStats', ({ target, hp, xp, gold }) => {
      if (target === playerName) {
        if (hp !== undefined) setHp(hp);
        if (xp !== undefined) setXp(xp);
        if (gold !== undefined) setGold(gold);
      }
    });

    socket.on('updateInventory', ({ target, inventory }) => {
      if (target === playerName) {
        setInventory(inventory);
      }
    });

    socket.on('gameLog', (msg) => {
      setLog((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('updateStats');
      socket.off('updateInventory');
      socket.off('gameLog');
    };
  }, [socket, playerName]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {characterData?.name || playerName}</h2>

      <div style={{ marginBottom: 20 }}>
        <h3>Character Sheet</h3>
        <pre>{JSON.stringify(characterData, null, 2)}</pre>
      </div>

      <h3>Stats</h3>
      <p>HP: {hp}</p>
      <p>XP: {xp}</p>
      <p>Gold: {gold}</p>

      <h3>Inventory</h3>
      {inventory.length > 0 ? (
        <ul>
          {inventory.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No items yet.</p>
      )}

      <h3>Game Log</h3>
      <div
        style={{
          background: '#111',
          color: '#0f0',
          padding: 10,
          maxHeight: 200,
          overflowY: 'auto',
        }}
      >
        {log.map((entry, idx) => (
          <div key={idx}>{entry}</div>
        ))}
      </div>
    </div>
  );
}
