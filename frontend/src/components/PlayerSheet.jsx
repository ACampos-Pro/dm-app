import React from 'react';

const PlayerSheet = ({ player }) => {
    if (!player) return null;
    const { info, role, stats, skills, background, hp, maxHp } = player;
    const hpPercentage = maxHp > 0 ? (hp / maxHp) * 100 : 0;

    return (
        <div className="player-sheet-view">
            <div className="sheet-section">
                <h3>{info.name} "{info.alias}"</h3>
                <div className="sheet-item"><strong>Role:</strong> {role}</div>
                <div className="sheet-item"><strong>Look:</strong> {info.look}</div>
                <hr style={{borderColor: '#45475a', margin: '1rem 0'}}/>
                <h3>Background</h3>
                <div className="sheet-item"><strong>Born:</strong> {background.birthplace}</div>
                <div className="sheet-item"><strong>Hunted By:</strong> {background.hunter}</div>
            </div>
            <div className="sheet-section">
                <h3>Vitals & Stats</h3>
                <div className="sheet-item"><strong>HP:</strong> {hp} / {maxHp}</div>
                <div className="hp-bar"><div className="hp-bar-inner" style={{width: `${hpPercentage}%`}}></div></div>
                <div className="sheet-item" style={{marginTop: '1rem'}}><strong>Gold:</strong> {info.gold}</div>
                <hr style={{borderColor: '#45475a', margin: '1rem 0'}}/>
                {Object.entries(stats).map(([key, value]) => (
                    <div key={key} className="sheet-item"><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</div>
                ))}
                <hr style={{borderColor: '#45475a', margin: '1rem 0'}}/>
                <div className="sheet-item"><strong>Skills:</strong> {skills.join(', ')}</div>
            </div>
            <div style={{textAlign: 'center', marginTop: '1rem'}}>
                <button onClick={() => alert('Inventory feature coming soon!')}>Open Inventory</button>
            </div>
        </div>
    );
};

export default PlayerSheet;
