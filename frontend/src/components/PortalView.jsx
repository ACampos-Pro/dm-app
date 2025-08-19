import React, { useState } from 'react';

const PortalView = ({ setErrorMessage, socket }) => {
    const [sessionCode, setSessionCode] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [dmPassword, setDmPassword] = useState('');
    const [isDmLogin, setIsDmLogin] = useState(false);

    const handleJoinAsPlayer = () => {
        if (!sessionCode || !playerName) {
            setErrorMessage('Please enter a name and session code.');
            return;
        }
        socket.emit('joinSession', { sessionCode, playerName, isDM: false });
    };

    const handleJoinAsDM = () => {
        const code = sessionCode.trim() || 'DM_SESSION_' + Date.now();
        socket.emit('joinSession', { sessionCode: code, password: dmPassword, isDM: true });
    };

    return (
        <div className="view">
            <h1>Dungeon Master Portal</h1>
            <p className="subtitle">Join a session or create a new one as the DM.</p>
            <div className="input-group">
                <input type="text" placeholder="Session Code" value={sessionCode} onChange={(e) => setSessionCode(e.target.value)} />
                {!isDmLogin && <input type="text" placeholder="Your Character's Name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />}
            </div>
            {isDmLogin ? (
                <div>
                    <input type="password" placeholder="DM Password" value={dmPassword} onChange={(e) => setDmPassword(e.target.value)} />
                    <button onClick={handleJoinAsDM}>Start DM Session</button>
                </div>
            ) : (
                <div className="button-group">
                    <button onClick={handleJoinAsPlayer}>Join as Player</button>
                    <button className="dm-button" onClick={() => setIsDmLogin(true)}>Join as DM</button>
                </div>
            )}
        </div>
    );
};

export default PortalView;
