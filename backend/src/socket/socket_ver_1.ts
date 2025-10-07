import { Socket } from "socket.io";
import { ACTIONS } from "../constants/socketActions";
import { socketUserMapping } from "../constants/socketUserMapping";
import { io } from "..";
export const socketHandlerV1 = (socket : Socket) => {
    console.log('New connection  : ', socket.id)
    socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
        socketUserMapping[socket.id] = user;
        const clientsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

        // socket.emit(ACTIONS.RELAY_PEERS, existingPeers);
        clientsInRoom.forEach((clientId) => {
            socket.emit(ACTIONS.ADD_PEER, {
                peerId: clientId,
                createOffer: true,
                user: socketUserMapping[clientId]
            })
            //Can use broadcast also like below
            io.to(clientId).emit(ACTIONS.ADD_PEER, {
                peerId: socket.id,
                createOffer: false,
                user
            })
        });

        // //    Use `socket.broadcast` to send to everyone except the current socket.
        // socket.broadcast.to(roomId).emit(ACTIONS.ADD_PEER, {
        //     peerId: socket.id,
        //     createOffer: false,
        //     user,
        // });

        socket.join(roomId);
        console.log('[JOIN] socket:', socket.id, 'room:', roomId, 'clients:', clientsInRoom);
    });
    // WRONG socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    //     socketUserMapping[socket.id] = user;
    //     // join first
    //     socket.join(roomId);

    //     // get all other clients (exclude current socket)
    //     const clientsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
    //         .filter(id => id !== socket.id);

    //     clientsInRoom.forEach(clientId => {
    //         // tell existing clients that a new peer joined
    //         io.to(clientId).emit(ACTIONS.ADD_PEER, {
    //             peerId: socket.id,
    //             createOffer: false,
    //             user
    //         });

    //         // tell the new socket to add existing peer and create offer
    //         socket.emit(ACTIONS.ADD_PEER, {
    //             peerId: clientId,
    //             createOffer: true,
    //             user: socketUserMapping[clientId] // existing client's user
    //         });
    //     });

    //     console.log('[JOIN] socket:', socket.id, 'room:', roomId, 'clients:', clientsInRoom);
    // });
    // Handle  Relay ice
    socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
            peerId: socket.id,
            icecandidate
        })
    })

    //Handle relay sdp(session  description)
    socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerId: socket.id,
            sessionDescription
        })
    })
    //Leaving room handler
    const leaveRoom = () => {
        //all joined rooms currently by  `socket  `
        const { rooms } = socket;
        Array.from(rooms).forEach((roomId) => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

            clients.forEach((clientId) => {
                //Pass message to all the clients to remove me `socket`

                io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: socketUserMapping[socket.id]?._id

                })

                //Pass the `socket` all the clients to be removed
                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerId: clientId,
                    userId: socketUserMapping[clientId]?._id
                })
            })

            //Now socket leave the room `roomId`
            socket.leave(roomId)

        });
        //Delete from socketMapping
        delete socketUserMapping[socket.id];
    }
    //WRONG  const leaveRoom = () => {
    //     for (const r of socket.rooms) {
    //         if (r === socket.id) continue; // skip own auto-room
    //         const clients = Array.from(io.sockets.adapter.rooms.get(r) || []);
    //         clients.forEach(clientId => {
    //             io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
    //                 peerId: socket.id,
    //                 userId: socketUserMapping[socket.id]?._id
    //             });
    //             socket.emit(ACTIONS.REMOVE_PEER, {
    //                 peerId: clientId,
    //                 userId: socketUserMapping[clientId]?._id
    //             });
    //         });
    //         socket.leave(r);
    //     }
    //     delete socketUserMapping[socket.id];
    // }

    //Call the leaveRoom handler
    socket.on(ACTIONS.LEAVE, leaveRoom)
    //Leaving the websocket like closing browser
    socket.on('disconnecting', leaveRoom)

    //Handle mute unmute

    socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
        // Broadcast to everyone ELSE in the room
        socket.broadcast.to(roomId).emit(ACTIONS.MUTE, {
            peerId: socket.id,
            userId
        });
    });

    socket.on(ACTIONS.UNMUTE, ({ roomId, userId }) => {
        // Broadcast to everyone ELSE in the room
        socket.broadcast.to(roomId).emit(ACTIONS.UNMUTE, {
            peerId: socket.id,
            userId
        });
    });
}