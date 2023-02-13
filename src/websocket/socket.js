import {io} from 'socket.io-client';
import * as uuid from 'uuid';
import eventHandler from '../event_handler/eventHandler';

if (!getCookie('login_token')) generateNewToken()

const socket = io(process.env.REACT_APP_SOCKET_URL, {
    transports : ['websocket'],
    auth: {
        token: getCookie('login_token'),
        conn_type: 'web-user'
    }
});

socket.on("connect", () => {
    console.log('[websocket] connected',socket.id)
});
  
socket.on("disconnect", () => {
    console.log('[websocket] disconnected')
});

async function socketHasConnected() {
    return new Promise((resolve,reject) => {
        if (socket.connected) return resolve(true)
        else {
            socket.on("connect", () => {
                return resolve(true)
            });
        }
    })
}

async function generateNewToken() {
    document.cookie = `login_token=${uuid.v4()};path=/`;
    //socket.emit('restartConn')
    socket.auth.token = getCookie('login_token')
    eventHandler.emit('login/auth', {})
    await socketHasConnected()
    socket.disconnect()
    socket.connect()
}
function getCookie(name) {
    return document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=')[1]
}

export {
    socket,
    socketHasConnected,
    generateNewToken
}