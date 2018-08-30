import messaging from './messaging'

class TronMask {
    connect(callback) {
        messaging.send('connect', {}, callback)
    }

    getAccount(callback) {
        messaging.send('get_account', {}, callback)
    }
}

window.TronMask = new TronMask()
