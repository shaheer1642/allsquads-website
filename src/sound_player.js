import {config} from "./config"

const playSound = {
    newMessage: () => {
        if (config.play_sounds.new_message)
            new Audio('/sounds/new_message.mp3').play()
    }
}

export default playSound