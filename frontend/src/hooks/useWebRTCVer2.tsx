import { useCallback, useEffect, useRef } from "react";
import type { User } from "../store/authSlice";
import { useStateWithCallback } from "./useStateWithCallback";
import { socketInit } from "../sockets";
import { ACTIONS } from "../sockets/actions";
import { getIceServers } from "../store/getIceServers";

export interface ClientInterface extends User { muted: boolean }
const joineeDummyData: ClientInterface[] = []

export interface AudioInterface {
    [userId: string]: any;
}
export interface ConnectionInterface {
    [peerId: string]: RTCPeerConnection
}
export const useWebRTCVersion2 = (roomId: string, user: User) => {
    const [clients, setClients] = useStateWithCallback(joineeDummyData);
    const audioElements = useRef<AudioInterface>({});
    const connections = useRef<ConnectionInterface>({});
    const socket = useRef<SocketIOClient.Socket>(null);
    const localMediaStream = useRef<MediaStream>(null);
    const clientsRef = useRef<ClientInterface[]>(null);

    const addNewClient = useCallback(
        (newClient: ClientInterface, cb: () => any) => {
            const lookingFor = clients.find(
                (client) => client._id === newClient._id
            );

            if (lookingFor === undefined) {
                setClients(
                    (existingClients: ClientInterface[]) => [...existingClients, newClient],
                    cb
                );
            }
        },
        [clients, setClients]
    );

    useEffect(() => {
        clientsRef.current = clients;
    }, [clients]);

    useEffect(() => {
        const initChat = async () => {
            socket.current = socketInit();
            await captureMedia();
            addNewClient({ ...user, muted: true }, () => {
                const localElement = audioElements.current[user._id];
                if (localElement) {
                    localElement.volume = 0;
                    localElement.srcObject = localMediaStream.current;
                }
            });
            socket.current.on(ACTIONS.MUTE_INFO, ({ userId, isMute }: { userId: string, isMute: boolean }) => {
                handleSetMute(isMute, userId);
            });

            socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
            socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
            socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
            socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
            socket.current.on(ACTIONS.MUTE, ({ userId }: { peerId: string, userId: string }) => {
                handleSetMute(true, userId);
            });
            socket.current.on(ACTIONS.UNMUTE, ({ userId }: { peerId: string, userId: string }) => {
                handleSetMute(false, userId);
            });
            socket.current.emit(ACTIONS.JOIN, {
                roomId,
                user,
            });

            async function captureMedia() {
                // Start capturing local audio stream.
                localMediaStream.current =
                    await navigator.mediaDevices.getUserMedia({
                        audio: true,
                    });
            }
            async function handleNewPeer({
                peerId,
                createOffer,
                user: remoteUser,
            }: { peerId: string, createOffer: boolean, user: ClientInterface }) {
                if (peerId in connections.current) {
                    return console.warn(
                        `You are already connected with ${peerId} (${user.name})`
                    );
                }

                // Store it to connections
                connections.current[peerId] = new RTCPeerConnection({
                    iceServers: getIceServers()
                });

                // Handle new ice candidate on this peer connection
                connections.current[peerId].onicecandidate = (event) => {
                    socket.current?.emit(ACTIONS.RELAY_ICE, {
                        peerId,
                        icecandidate: event.candidate,
                    });
                };

                // Handle on track event on this connection
                connections.current[peerId].ontrack = ({
                    streams: [remoteStream],
                }) => {
                    addNewClient({ ...remoteUser, muted: true }, () => {
                        // get current users mute info
                        const currentUser = clientsRef.current?.find(
                            (client) => client._id === user._id
                        );
                        if (currentUser) {
                            socket.current?.emit(ACTIONS.MUTE_INFO, {
                                userId: user._id,
                                roomId,
                                isMute: currentUser.muted,
                            });
                        }
                        if (audioElements.current[remoteUser._id]) {
                            audioElements.current[remoteUser._id].srcObject =
                                remoteStream;
                        } else {
                            let settled = false;
                            const interval = setInterval(() => {
                                if (audioElements.current[remoteUser._id]) {
                                    audioElements.current[
                                        remoteUser._id
                                    ].srcObject = remoteStream;
                                    settled = true;
                                }

                                if (settled) {
                                    clearInterval(interval);
                                }
                            }, 300);
                        }
                    });
                };

                // Add connection to peer connections track
                localMediaStream.current?.getTracks().forEach((track) => {
                    connections.current[peerId].addTrack(
                        track,
                        //@ts-ignore
                        localMediaStream.current
                    );
                });

                // Create an offer if required
                if (createOffer) {
                    const offer = await connections.current[
                        peerId
                    ].createOffer();

                    // Set as local description
                    await connections.current[peerId].setLocalDescription(
                        offer
                    );

                    // send offer to the server
                    socket.current?.emit(ACTIONS.RELAY_SDP, {
                        peerId,
                        sessionDescription: offer,
                    });
                }
            }
            async function handleRemovePeer({ peerId, userId }: { peerId: string, userId: string }) {
                // Correction: peerID to peerId
                if (connections.current[peerId]) {
                    connections.current[peerId].close();
                }

                delete connections.current[peerId];
                delete audioElements.current[peerId];
                setClients((list: ClientInterface[]) => list.filter((c) => c._id !== userId));
            }
            async function handleIceCandidate({ peerId, icecandidate }: { peerId: string, icecandidate: RTCIceCandidate | null }) {
                if (icecandidate) {
                    connections.current[peerId].addIceCandidate(icecandidate);
                }
            }
            async function setRemoteMedia({
                peerId,
                sessionDescription: remoteSessionDescription,
            }: { peerId: string, sessionDescription: RTCSessionDescription | any }) {
                connections.current[peerId].setRemoteDescription(
                    new RTCSessionDescription(remoteSessionDescription)
                );

                // If session descrition is offer then create an answer
                if (remoteSessionDescription.type === 'offer') {
                    const connection = connections.current[peerId];

                    const answer = await connection.createAnswer();
                    connection.setLocalDescription(answer);

                    socket.current?.emit(ACTIONS.RELAY_SDP, {
                        peerId,
                        sessionDescription: answer,
                    });
                }
            }
            async function handleSetMute(mute: boolean, userId: any) {
                const clientIdx = clientsRef.current
                    ?.map((client) => client._id)
                    .indexOf(userId);
                const allConnectedClients = JSON.parse(
                    JSON.stringify(clientsRef.current)
                );
                if (clientIdx !== undefined && clientIdx > -1) {
                    allConnectedClients[clientIdx].muted = mute;
                    setClients(allConnectedClients);
                }
            }
        };

        initChat();
        return () => {
            localMediaStream.current
                ?.getTracks()
                .forEach((track) => track.stop());
            socket.current?.emit(ACTIONS.LEAVE, { roomId });
            for (let peerId in connections.current) {
                connections.current[peerId].close();
                delete connections.current[peerId];
                delete audioElements.current[peerId];
            }
            socket.current?.off(ACTIONS.REMOVE_PEER);
            socket.current?.off(ACTIONS.ICE_CANDIDATE);
            socket.current?.off(ACTIONS.SESSION_DESCRIPTION);
            socket.current?.off(ACTIONS.MUTE);
            socket.current?.off(ACTIONS.UNMUTE);
        };
    }, []);

    const provideRef = (instance: HTMLAudioElement | null, userId: string | any) => {
        audioElements.current[userId] = instance;
    };

    const handleMute = (isMute: boolean, userId: any) => {
        let settled = false;

        if (userId === user._id) {
            let interval = setInterval(() => {
                if (localMediaStream.current) {
                    localMediaStream.current.getTracks()[0].enabled = !isMute;
                    if (isMute) {
                        socket.current?.emit(ACTIONS.MUTE, {
                            roomId,
                            userId: user._id,
                        });
                    } else {
                        socket.current?.emit(ACTIONS.UNMUTE, {
                            roomId,
                            userId: user._id,
                        });
                    }
                    settled = true;
                }
                if (settled) {
                    clearInterval(interval);
                }
            }, 200);
        }
    };

    return {
        clients,
        provideRef,
        handleMute,
    };
};