import { sendMessage, listenMessage } from './messaging'

// Listen Content Messaging
listenMessage('content', function(msg){
    if (msg.name === 'connect') {
        setTimeout(() => {
            sendMessage('content', 'connect', 'test')
        }, 1000)

        return
    }
})
