import  io from 'socket.io-client'
import { baseURL } from '../http';
export const socketInit =  ()=>{
    const options  = {
        'force new connection' : true,
        reconnectionAttempt : 'Infinity',
        timeout : 10000,
        transports  : ['websockets']
    };
    return io(baseURL , options)
}