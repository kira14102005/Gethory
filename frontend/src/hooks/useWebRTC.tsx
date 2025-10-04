import { useStateWithCallback } from "./useStateWithCallback";
const joineeDummyData = [{
    _id: 1,
    name: "Rakesh K"
},
{
    _id: 2,
    name: "Kaishal Openuy"
}]
export const useWebRTC = () => {
    const [clients, setClients] = useStateWithCallback(joineeDummyData);

    return { clients }

}