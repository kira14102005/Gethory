import { useCallback, useEffect, useRef } from "react";
import type { User } from "../store/authSlice";
import { useStateWithCallback } from "./useStateWithCallback";
import { socketInit } from "../sockets";
import { ACTIONS } from "../store/actions";
import { getIceServers } from "../store/getIceServers";
export type ClientInterface = {
    _id: string,
    name: string
}

const joineeDummyData: ClientInterface[] = [{
    _id: '1',
    name: "Rakesh K"
},
{
    _id: '2',
    name: "Kaishal Openuy"
}]

export interface AudioInterface {
    [userId: string]: any;
}
export interface ConnectionInterface {
    [peerId: string]: RTCPeerConnection
}
export const useWebRTC = (roomId: string, user: User) => {
    const [clients, setClients] = useStateWithCallback(joineeDummyData);
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

    useEffect(() => {
        const handleNewPeer = async ({ peerId, createOffer, user }: { peerId: string, createOffer: boolean, user: User }) => {
            if (peerId in connections.current) {
                return console.warn(
                    `Youare already connected with ${peerId} ${user.name}`
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
                addNewClient(user, () => {
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
                connections.current[peerId].addTrack(track, localmediaStream.current)
            })

            //Create offer
            if (createOffer) {
                const offer = await connections.current[peerId].createOffer()

                //setLocalDescription


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
            addNewClient(user, () => {
                const localElement = audioElements.current[user._id]
                localElement.volume = 0
                localElement.srcObject = localmediaStream.current

                //Scoket JOIN
                socketRef.current?.emit(ACTIONS.JOIN, { roomId, user })
            })
        }).catch((err) => { })
    }, [])


    return { clients, provideRef }

}