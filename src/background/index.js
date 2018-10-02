import messaging from './messaging'
import notifications from './notifications'

// Actions
const actions = {
    getState() {
        return JSON.parse(localStorage.getItem('vuex'))
    },

    allowed(domain) {
        const state = this.getState()
        const dapp = state.dapps.dapps.filter(d => d.domain.toLowerCase() === domain.toLowerCase())
        return dapp.length > 0
    },

    unauthorized(msg, sender) {
        messaging.postContent(msg.name, {
            status: 'error',
            type: 'UNAUTHORIZED'
        }, sender.tab.id)
    },

    account(msg, sender) {
        const state = this.getState()
        messaging.postContent(msg.name, {
            status: 'success',
            data: {
                address: state.wallet.address,
                network: state.network
            }
        }, sender.tab.id)
    },

    walletAvailable() {
        const state = this.getState()
        return state.wallet.keystore && state.wallet.address
    },

    connect(msg, sender) {
        if (this.allowed(msg.domain)) {
            this.account(msg, sender)
            return
        }

        if (!this.walletAvailable()) {
            messaging.postContent(msg.name, {
                status: 'error',
                type: 'WALLET_UNAVAILABLE'
            }, sender.tab.id)

            return
        }

        notifications.show('connect', {
            domain: msg.domain,
            favicon: sender.tab.favIconUrl || ''
        }, sender.tab.id)
    },

    getAccount(msg, sender) {
        if (!this.allowed(msg.domain)) {
            this.unauthorized(msg, sender)
            return
        }

        this.account(msg, sender)
    },

    submitTransaction(msg, sender) {
        if (!this.allowed(msg.domain)) {
            this.unauthorized(msg, sender)
            return
        }

        notifications.show('submit_transaction', {}, sender.tab.id)
        notifications.sendPayload({ tx: msg.payload.tx })
    },

    sendTrx(msg, sender) {
        if (!this.allowed(msg.domain)) {
            this.unauthorized(msg, sender)
            return
        }

        notifications.show('send_trx', {
            to: msg.payload.to,
            amount: msg.payload.amount
        }, sender.tab.id)
    },

    sendToken(msg, sender) {
        if (!this.allowed(msg.domain)) {
            this.unauthorized(msg, sender)
            return
        }

        notifications.show('send_token', {
            to: msg.payload.to,
            amount: msg.payload.amount,
            tokenID: msg.payload.tokenID
        }, sender.tab.id)
    }
}

// Listen Content Messaging
messaging.listen('content', (msg, sender) => {
    switch (msg.name) {
        case 'tronmask_connect':
            actions.connect(msg, sender)
            break

        case 'tronmask_get_account':
            actions.getAccount(msg, sender)
            break

        case 'tronmask_submit_transaction':
            actions.submitTransaction(msg, sender)
            break

        case 'tronmask_send_trx':
            actions.sendTrx(msg, sender)
            break

        case 'tronmask_send_token':
            actions.sendToken(msg, sender)
            break

        default:
            break
    }
})

// Listen Popup Messaging
messaging.listen('popup', msg => {
    const methods = [
        'tronmask_connect',
        'tronmask_submit_transaction',
        'tronmask_send_trx',
        'tronmask_send_token',
    ]

    if (methods.includes(msg.name)) {
        messaging.postContent(msg.name, msg.payload, msg.tabid)
    }
})
