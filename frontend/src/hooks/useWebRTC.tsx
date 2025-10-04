import { useCallback, useEffect, useRef } from "react";
import type { User } from "../store/authSlice";
import { useStateWithCallback } from "./useStateWithCallback";
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
export const useWebRTC = (roomId: string, user: User) => {
    const [clients, setClients] = useStateWithCallback(joineeDummyData);
    const audioElements = useRef<AudioInterface>({})
    const localmediaStream = useRef<MediaStream>(null)
    const connections = useRef({})

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
            })
        }).catch((err) => { })
    }, [])
    return { clients, provideRef }

}