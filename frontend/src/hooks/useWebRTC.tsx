import { useRef } from "react";
import type { User } from "../store/authSlice";
import { useStateWithCallback } from "./useStateWithCallback";
const joineeDummyData = [{
    _id: 1,
    name: "Rakesh K"
},
{
    _id: 2,
    name: "Kaishal Openuy"
}]

export interface AudioInterface {
    [userId: string]: any;
}
export const useWebRTC = (roomId: string, user: User) => {
    const [clients, setClients] = useStateWithCallback(joineeDummyData);
    const audioElements = useRef<AudioInterface>({})
    const localmediaStream = useRef(null)
    const connections = useRef({})

    const provideRef = (instance: any, userId: number | string) => {
        audioElements.current[userId] = instance
    }
    return { clients, provideRef }

}