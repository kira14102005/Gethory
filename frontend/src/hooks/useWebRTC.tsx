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
export const useWebRTC = (roomId: string, user: User) => {
    const [clients, setClients] = useStateWithCallback(joineeDummyData);
    const clientRef = useRef<ClientInterface[]>([])   //we want an updated copy of the clients on whose change there is no component re render
    const audioElements = useRef<AudioInterface>({})
    const localmediaStream = useRef<MediaStream>(null)
    const connections = useRef<ConnectionInterface>({})
    const socketRef = useRef<SocketIOClient.Socket>(null)
    const provideRef = (instance: any, userId: number | string) => {
        audioElements.current[userId] = instance
    }

    const addNewClient = useCallback((newClient: ClientInterface, cb: () => any) => {
        const alreadyPresent = clients.find((client) => client._id === newClient._id)

        if (!alreadyPresent) setClients(
            (existingClients: ClientInterface[]) => {
                return [...existingClients, newClient]
            }, cb)

    }, [clients, setClients])
    useEffect(() => {
        socketRef.current = socketInit()
    }, [])
    //Start capture media
    useEffect(() => {
        const startCapture = async () => {
            localmediaStream.current = await navigator.mediaDevices.getUserMedia({
                audio: true
            })
        }
        startCapture().then(() => {
            //Now add to the list of Clients
            //@ts-ignore 
            addNewClient({ ...user, muted: true }, () => {
                const localElement = audioElements.current[user._id]
                localElement.volume = 0
                localElement.srcObject = localmediaStream.current

                //Scoket JOIN
                socketRef.current?.emit(ACTIONS.JOIN, { roomId, user })
            })
        }).catch((err) => {
            console.log('Error : ', err)
        })
        //on Leave the window or Dismounting
        return () => {
            //Leaving the room
            localmediaStream.current?.getTracks().forEach((track) => {
                return track.stop()
            })

            socketRef.current?.emit(ACTIONS.LEAVE, { roomId })
        }
    }, [])

    useEffect(() => {
        const handleNewPeer = async ({ peerId, createOffer, user }: { peerId: string, createOffer: boolean, user: User }) => {
            if (peerId in connections.current) {
                return console.warn(
                    `You are already connected with ${peerId} ${user.name}`
                );
            }
            connections.current[peerId] = new RTCPeerConnection({
                iceServers: getIceServers()
            })

            //Handle new Icecandidate
            connections.current[peerId].onicecandidate = (event) => {
                socketRef.current?.emit(ACTIONS.RELAY_ICE, {
                    peerId,
                    icecandidate: event.candidate
                })
            }
            //Handle on track on this connection
            connections.current[peerId].ontrack = ({
                streams: [remoteStream]
            }) => {
                //@ts-ignore
                addNewClient({ ...user, muted: true }, () => {
                    if (audioElements.current[user._id]) {
                        audioElements.current[user._id].srcObject = remoteStream
                    }
                    else {
                        let settled = false;
                        const interval = setInterval(() => {
                            if (audioElements.current[user._id]) {
                                audioElements.current[user._id].srcObject = remoteStream
                                settled = true
                            }
                            if (settled) {
                                clearInterval(interval)
                            }
                        }, 1000)
                    }
                });

            }
            //Add local track to remote connections
            localmediaStream.current?.getTracks().forEach(track => {
                //@ts-ignore
                connections.current[peerId].addTrack(track, localmediaStream.current)
            })

            //Create offer
            if (createOffer) {
                const offer = await connections.current[peerId].createOffer()

                //setLocalDescription
                await connections.current[peerId].setLocalDescription(offer)

                //send offer
                socketRef.current?.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: offer
                })
            }

        };

        socketRef.current?.on(ACTIONS.ADD_PEER, handleNewPeer)
        return () => {
            socketRef.current?.off(ACTIONS.ADD_PEER)
        }
    }
        , [])

    //Handle ice_Candidate received from server
    useEffect(() => {
        socketRef.current?.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }: { peerId: string, icecandidate: any }) => {
            if (icecandidate)
                connections.current[peerId].addIceCandidate(icecandidate)
        })

        return () => {
            socketRef.current?.off(ACTIONS.ICE_CANDIDATE)
        }
    }, [])

    //Handle RemoteSDP
    useEffect(() => {

        const handleRemoteSdp = async ({ peerId, sessionDescription: remoteSessionDescription }: { peerId: string, sessionDescription: any }) => {
            await connections.current[peerId].setRemoteDescription(new RTCSessionDescription(remoteSessionDescription))

            //if sdp is type of offer then create ans
            if (remoteSessionDescription.type === 'offer') {
                const conn = connections.current[peerId]
                const ans = await conn.createAnswer()
                conn.setLocalDescription(ans)

                socketRef.current?.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: ans
                })
            }

        }
        socketRef.current?.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp)

        return () => {
            socketRef.current?.off(ACTIONS.SESSION_DESCRIPTION)
        }
    }, [])

    // handle remove user
    useEffect(() => {
        const handleRemovePeer = async ({ peerId, userId }: { peerId: string, userId: string }) => {
            if (connections.current[peerId]) {
                connections.current[peerId].close()

                delete connections.current[peerId]
                delete audioElements.current[peerId]
                setClients((list: ClientInterface[]) => list.filter((client) => client._id !== userId))
            }
        }

        socketRef.current?.on(ACTIONS.REMOVE_PEER, handleRemovePeer)

        return () => {
            socketRef.current?.off(ACTIONS.REMOVE_PEER)
        }
    }, [])

    useEffect(() => {
        clientRef.current = clients
    }, [clients])

    //Listen for mute/unmute
    useEffect(() => {
        socketRef.current?.on(ACTIONS.MUTE, ({ userId }: { peerId: string, userId: string }) => {
            setMute(true, userId)
        })
        socketRef.current?.on(ACTIONS.UNMUTE, ({ userId }: { peerId: string, userId: string }) => {
            setMute(false, userId)
        })

        const setMute = (mute: boolean, userId: string) => {
            const clientIdx = clientRef.current.map(client => client._id).indexOf(userId)
            const connectedClients = JSON.parse(JSON.stringify(clientRef.current))   //Need deeep copy here
            if (clientIdx > -1) {
                connectedClients[clientIdx].muted = mute
                setClients(connectedClients)
            }

        }
    })


    //handling mute
    const handleMute = (isMute: boolean, userId: string | undefined) => {
        let settled = false
        if (localmediaStream.current) localmediaStream.current.getTracks()[0].enabled = !isMute;
        else {
            let interval = setInterval(() => {
                if (localmediaStream.current) localmediaStream.current.getTracks()[0].enabled = !isMute;
                if (isMute) {
                    socketRef?.current?.emit(ACTIONS.MUTE, {
                        roomId,
                        userId
                    })
                } else {
                    socketRef?.current?.emit(ACTIONS.UNMUTE, {
                        roomId,
                        userId
                    });
                }
                if (settled) {
                    clearInterval(interval)
                }

            }, 200)

        }
    }
    return { clients, provideRef, handleMute }

}