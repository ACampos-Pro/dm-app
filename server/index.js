const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors()); 

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const DM_PASSWORD = "dungeonmaster";

const sessions = {};

const updateDmPlayerList = (sessionCode) => {
    if (sessions[sessionCode]) {
        io.to(sessionCode).emit('dm:updatePlayerList', sessions[sessionCode].players);
    }
};

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);
    let currentSessionCode = null;

    socket.on('joinSession', ({ sessionCode, playerName, isDM, password }) => {
        if (isDM) {
            if (password === DM_PASSWORD) {
                console.log(`DM creating/joining session: ${sessionCode}`);
                socket.join(sessionCode);
                currentSessionCode = sessionCode;
                if (!sessions[sessionCode]) {
                    sessions[sessionCode] = { players: {} };
                }
                socket.emit('sessionJoined', { success: true, isDM: true, sessionCode });
                updateDmPlayerList(sessionCode);
            } else {
                socket.emit('sessionJoined', { success: false, message: 'Incorrect DM password.' });
            }
        } else {
            if (!sessions[sessionCode]) {
                socket.emit('sessionJoined', { success: false, message: 'Session not found.' });
                return;
            }
            console.log(`Player '${playerName}' joining session: ${sessionCode}`);
            socket.join(sessionCode);
            currentSessionCode = sessionCode;
            if (sessions[sessionCode].players[socket.id]) {
                socket.emit('sessionJoined', { success: true, isDM: false });
                socket.emit('showPlayerView', sessions[sessionCode].players[socket.id]);
            } else {
                socket.emit('sessionJoined', { success: true, isDM: false });
                socket.emit('showCharacterCreation', { playerName });
            }
        }
    });

    socket.on('character:create', (characterData) => {
        if (currentSessionCode && sessions[currentSessionCode]) {
            console.log(`Creating character for ${socket.id}`);
            
            // NEW: Calculate HP based on Grit
            const grit = parseInt(characterData.stats.grit, 10) || 1;
            characterData.hp = grit * 3;
            characterData.maxHp = grit * 3;

            sessions[currentSessionCode].players[socket.id] = {
                id: socket.id,
                ...characterData
            };
            
            socket.emit('showPlayerView', sessions[currentSessionCode].players[socket.id]);
            updateDmPlayerList(currentSessionCode);
        }
    });

    socket.on('dm:dealDamage', ({ targetPlayerId, amount }) => {
        if (currentSessionCode && sessions[currentSessionCode]?.players[targetPlayerId]) {
            const player = sessions[currentSessionCode].players[targetPlayerId];
            // UPDATED: Damage is now dealt to HP, not Grit
            player.hp = Math.max(0, parseInt(player.hp) - parseInt(amount)); 

            console.log(`DM dealt ${amount} damage to ${player.info.name}. New HP: ${player.hp}`);

            io.to(targetPlayerId).emit('player:updateSheet', player);
            io.to(targetPlayerId).emit('player:notify', { message: `You took ${amount} damage!` });
            updateDmPlayerList(currentSessionCode);
        }
    });

    // NEW: Handler for giving gold
    socket.on('dm:giveGold', ({ targetPlayerId, amount }) => {
        if (currentSessionCode && sessions[currentSessionCode]?.players[targetPlayerId]) {
            const player = sessions[currentSessionCode].players[targetPlayerId];
            player.info.gold = (parseInt(player.info.gold) || 0) + parseInt(amount);

            console.log(`DM gave ${amount} gold to ${player.info.name}. New total: ${player.info.gold}`);

            io.to(targetPlayerId).emit('player:updateSheet', player);
            io.to(targetPlayerId).emit('player:notify', { message: `You received ${amount} gold!` });
            updateDmPlayerList(currentSessionCode);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        if (currentSessionCode && sessions[currentSessionCode]?.players[socket.id]) {
            delete sessions[currentSessionCode].players[socket.id];
            updateDmPlayerList(currentSessionCode);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} 🚀`);
});
