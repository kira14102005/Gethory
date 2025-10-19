"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandlerV2 = void 0;
const socketActions_1 = require("../constants/socketActions");
const socketUserMapping_1 = require("../constants/socketUserMapping");
const __1 = require("..");
const socketHandlerV2 = (socket) => {
    console.log('New connection', socket.id);
    socket.on(socketActions_1.ACTIONS.JOIN, ({ roomId, user }) => {
        socketUserMapping_1.socketUserMapping[socket.id] = user;
        const clients = Array.from(__1.io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            __1.io.to(clientId).emit(socketActions_1.ACTIONS.ADD_PEER, {
                peerId: socket.id,
                createOffer: false,
                user,
            });
            socket.emit(socketActions_1.ACTIONS.ADD_PEER, {
                peerId: clientId,
                createOffer: true,
                user: socketUserMapping_1.socketUserMapping[clientId],
            });
        });
        socket.join(roomId);
    });
    socket.on(socketActions_1.ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        __1.io.to(peerId).emit(socketActions_1.ACTIONS.ICE_CANDIDATE, {
            peerId: socket.id,
            icecandidate,
        });
    });
    socket.on(socketActions_1.ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        __1.io.to(peerId).emit(socketActions_1.ACTIONS.SESSION_DESCRIPTION, {
            peerId: socket.id,
            sessionDescription,
        });
    });
    socket.on(socketActions_1.ACTIONS.MUTE, ({ roomId, userId }) => {
        const clients = Array.from(__1.io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            __1.io.to(clientId).emit(socketActions_1.ACTIONS.MUTE, {
                peerId: socket.id,
                userId,
            });
        });
    });
    socket.on(socketActions_1.ACTIONS.UNMUTE, ({ roomId, userId }) => {
        const clients = Array.from(__1.io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            __1.io.to(clientId).emit(socketActions_1.ACTIONS.UNMUTE, {
                peerId: socket.id,
                userId,
            });
        });
    });
    socket.on(socketActions_1.ACTIONS.MUTE_INFO, ({ userId, roomId, isMute }) => {
        const clients = Array.from(__1.io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            if (clientId !== socket.id) {
                console.log('mute info');
                __1.io.to(clientId).emit(socketActions_1.ACTIONS.MUTE_INFO, {
                    userId,
                    isMute,
                });
            }
        });
    });
    const leaveRoom = () => {
        //all joined rooms currently by  `socket  `
        const { rooms } = socket;
        Array.from(rooms).forEach((roomId) => {
            const clients = Array.from(__1.io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach((clientId) => {
                //Pass message to all the clients to remove me `socket`
                var _a, _b;
                __1.io.to(clientId).emit(socketActions_1.ACTIONS.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: (_a = socketUserMapping_1.socketUserMapping[socket.id]) === null || _a === void 0 ? void 0 : _a._id
                });
                //Pass the `socket` all the clients to be removed
                socket.emit(socketActions_1.ACTIONS.REMOVE_PEER, {
                    peerId: clientId,
                    userId: (_b = socketUserMapping_1.socketUserMapping[clientId]) === null || _b === void 0 ? void 0 : _b._id
                });
            });
            //Now socket leave the room `roomId`
            socket.leave(roomId);
        });
        //Delete from socketMapping
        delete socketUserMapping_1.socketUserMapping[socket.id];
    };
    socket.on(socketActions_1.ACTIONS.LEAVE, leaveRoom);
    socket.on('disconnecting', leaveRoom);
};
exports.socketHandlerV2 = socketHandlerV2;
