import { socket, socketHasConnected } from "../websocket/socket";
import eventHandler from "../event_handler/eventHandler";

const as_users_list = {}

socketHasConnected().then(() => {
    console.log('socket connected, emitting users list')
    socket.emit('allsquads/userslist', {}, (res) => {
        if (res.code == 200) {
            res.data.forEach(row => {
                as_users_list[row.discord_id] = row
            })
            eventHandler.emit('usersList/loaded')
        }
    })
}).catch(console.error)

async function usersLoaded() {
    return new Promise((resolve,reject) => {
        if (Object.keys(as_users_list).length > 0) return resolve()
        else eventHandler.on('usersList/loaded', () => resolve())
    })
}

export {
    as_users_list,
    usersLoaded
}