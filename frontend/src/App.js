import React, { useState, useEffect } from 'react';
import PlayerView from './components/PlayerView';
import DMView from './components/DMView';
import PortalView from './components/PortalView';
import CharacterCreationView from './components/CharacterCreationView';
import PlayerSheet from './components/PlayerSheet';
import PlayerCard from './components/PlayerCard';
import './App.css';
import socket from './socket';
import CharacterCreator from './components/CharacterCreator';


// --- Main App Component ---
export default function App() {
    const [view, setView] = useState('portal');
    const [errorMessage, setErrorMessage] = useState('');
    const [sessionCode, setSessionCode] = useState('');
    const [playerData, setPlayerData] = useState(null);
    const [creationData, setCreationData] = useState(null);
    const [dmPlayers, setDmPlayers] = useState({});

    useEffect(() => {
        socket.on('sessionJoined', (data) => {
            if (data.success) {
                setErrorMessage('');
                if (data.isDM) {
                    setSessionCode(data.sessionCode);
                    setView('dm');
                }
            } else { setErrorMessage(data.message); }
        });
        socket.on('showCharacterCreation', (data) => { setCreationData(data); setView('creation'); });
        socket.on('showPlayerView', (data) => { setPlayerData(data); setView('player'); });
        socket.on('dm:updatePlayerList', (players) => setDmPlayers(players));
        socket.on('player:updateSheet', (data) => setPlayerData(data));
        socket.on('player:notify', (data) => {
            alert(data.message);
        });
        return () => {
            socket.off('sessionJoined');
            socket.off('showCharacterCreation');
            socket.off('showPlayerView');
            socket.off('dm:updatePlayerList');
            socket.off('player:updateSheet');
            socket.off('player:notify');
        };
    }, []);

    const renderView = () => {
        switch (view) {
            case 'creation':
                return <CharacterCreationView initialData={creationData} socket={socket} />;
            case 'player':
                // Pass sessionCode, playerName, characterData to PlayerView
                return <PlayerView
                    socket={socket}
                    sessionCode={sessionCode}
                    playerName={playerData?.info?.name || ''}
                    characterData={playerData}
                />;
            case 'dm':
                // Pass only socket and sessionCode to DMView
                return <DMView socket={socket} sessionCode={sessionCode} />;
            default:
                return <PortalView setErrorMessage={setErrorMessage} socket={socket} />;
        }
    };

    return <>{renderView()}{errorMessage && <p className="error">{errorMessage}</p>}</>;
}
