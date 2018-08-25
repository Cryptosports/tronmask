import { sendMessage, listenMessage } from './messaging'

class TronMask {
    connect(callback) {
        sendMessage('connect', { domain: window.location.hostname })

        listenMessage('connect', function(msg){
            callback(msg.payload)
        })
    }
}

window.TronMask = new TronMask()
