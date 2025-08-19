import React, { useState, useEffect } from 'react';
import PlayerSheet from './PlayerSheet';

export default function PlayerView({ socket, sessionCode, playerName, characterData }) {
  const [hp, setHp] = useState(characterData?.hp ?? 0);
  const [xp, setXp] = useState(characterData?.xp ?? 0);
  const [gold, setGold] = useState(characterData?.gold ?? 0);
  const [inventory, setInventory] = useState(characterData?.inventory ?? []);
  const [log, setLog] = useState([]);

  useEffect(() => {
    setHp(characterData?.hp ?? 0);
    setXp(characterData?.xp ?? 0);
    setGold(characterData?.gold ?? 0);
    setInventory(characterData?.inventory ?? []);
  }, [characterData]);

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
    <div className="view">
      <h2>Welcome, {characterData?.info?.name || playerName}</h2>
      <PlayerSheet player={{ ...characterData, hp, xp, gold, inventory }} />

      <div style={{ marginTop: 24 }}>
        <h3>Game Log</h3>
        <div
          style={{
            background: '#111',
            color: '#0f0',
            padding: 10,
            maxHeight: 200,
            overflowY: 'auto',
            borderRadius: 4,
            fontFamily: 'monospace',
            fontSize: 14,
          }}
        >
          {log.map((entry, idx) => (
            <div key={idx}>{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
