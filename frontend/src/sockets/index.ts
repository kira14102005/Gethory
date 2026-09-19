import io from 'socket.io-client'
export const socketInit = () => {
    const options = {
        transports: ['websocket'],
        reconnectionAttempts: Infinity, timeout: 10000
    };
    return io(import.meta.env.VITE_FULL_BACKEND_URL, options)
}