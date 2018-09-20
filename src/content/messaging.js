export default {
    postInpage(name, payload) {
        name = `${name}_response`
        window.postMessage({ from: 'content', name, payload }, '*')
    },

    listenInpage(callback) {
        window.addEventListener('message', event => {
            const msg = event.data || {}

            if (event.origin !== window.location.origin || msg.from !== 'inpage') {
                return
            }

            callback(msg, event)
        })
    },

    postBackground(name, payload) {
        chrome.runtime.sendMessage({ from: 'content', name, domain: window.location.hostname, payload })
    },

    listenBackground(name, callback) {
        const listener = (msg, sender) => {
            if (msg.from !== 'background' || msg.name !== name ) {
                return
            }

            callback(msg, sender)
            chrome.runtime.onMessage.removeListener(listener)
        }

        chrome.runtime.onMessage.addListener(listener)
    },

    sendBackground(name, payload, callback) {
        this.postBackground(name, payload)
        this.listenBackground(`${name}_response`, callback)
    }
}
