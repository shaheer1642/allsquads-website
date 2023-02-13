import { socket, socketHasConnected } from "../websocket/socket";
import eventHandler from "../event_handler/eventHandler";
import { getCookie } from "../functions";

var user_logged = null
var attempted_authorize = false

attemptAuthenticate()

function attemptAuthenticate() {
    attempted_authorize = false
    fetch(`${process.env.REACT_APP_SOCKET_URL}api/allsquads/authenticate?login_token=${getCookie('login_token')}`)
    .then((res) => res.json())
    .then((res) => {
        console.log('attemptAuthenticate',res)
        if (res.code == 200) {
            user_logged = res.data
        }
        attempted_authorize = true
        eventHandler.emit('userLogin/attempted')
    }).catch(console.error);
}

async function authorizationCompleted() {
    return new Promise((resolve,reject) => {
        if (attempted_authorize) return resolve()
        else eventHandler.on('userLogin/attempted', () => resolve())
    })
}

export {
    user_logged,
    authorizationCompleted
}