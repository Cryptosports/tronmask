import messaging from './messaging'

class TronMask {
    connect(callback) {
        messaging.send('connect', {}, callback)
    }

    getAccount(callback) {
        messaging.send('get_account', {}, callback)
    }

    getBalance(callback) {
        messaging.send('get_balance', {}, callback)
    }

    submitTransaction(tx, callback) {
        messaging.send('submit_transaction', { tx }, callback)
    }

    send(to, amount, callback) {
        messaging.send('send_trx', { to, amount }, callback)
    }

    sendToken(to, amount, tokenID, callback) {
        messaging.send('send_token', { to, amount, tokenID }, callback)
    }
}

window.TronMask = new TronMask()
