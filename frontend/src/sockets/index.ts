import io from 'socket.io-client'
export const socketInit = () => {
    const options = {
        transports: ['websocket'],
        reconnectionAttempts: Infinity, timeout: 10000
    };
    return io('http://kira14102005.dpdns.org', options)
}