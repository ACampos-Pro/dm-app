import React, { useState } from 'react';

const PlayerCard = ({ player, socket }) => {
    const [damage, setDamage] = useState('');
    const [gold, setGold] = useState('');

    const handleDealDamage = () => {
        if (damage && damage > 0) {
            socket.emit('dm:dealDamage', { targetPlayerId: player.id, amount: damage });
            setDamage('');
        }
    };
    const handleGiveGold = () => {
        if (gold && gold > 0) {
            socket.emit('dm:giveGold', { targetPlayerId: player.id, amount: gold });
            setGold('');
        }
    };
    return (
        <div className="player-card">
            <div className="player-card-header">
                <h3>{player.info.name}</h3>
                <span>HP: {player.hp}/{player.maxHp}</span>
            </div>
            <div className="player-card-stats">
                {Object.entries(player.stats).map(([key, value]) => <div key={key}>{key.slice(0,3).toUpperCase()}: <strong>{value}</strong></div>)}
                 <div>GLD: <strong>{player.info.gold}</strong></div>
            </div>
             <div className="dm-actions">
                <div className="dm-action-group">
                    <input type="number" placeholder="DMG" value={damage} onChange={(e) => setDamage(e.target.value)} />
                    <button onClick={handleDealDamage}>Damage HP</button>
                </div>
                <div className="dm-action-group">
                    <input type="number" placeholder="Gold" value={gold} onChange={(e) => setGold(e.target.value)} />
                    <button onClick={handleGiveGold}>Give Gold</button>
                </div>
            </div>
        </div>
    );
};

export default PlayerCard;
