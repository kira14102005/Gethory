import io from 'socket.io-client'
import { baseURL } from '../http';
export const socketInit = () => {
    const options = {
        transports: ['websocket'],
        reconnectionAttempts: Infinity, timeout: 10000
    };
    return io(baseURL, options)
}