import { sendMessage, listenMessage } from './messaging'
import { showNotifications } from './notifications'

// Listen Content Messaging
listenMessage('content', function(msg){
    if (msg.name === 'connect') {
        showNotifications(msg.name)

        return
    }
})
