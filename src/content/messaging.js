export function sendMessage(to, name, payload) {
    if (to === 'inpage') {
        window.postMessage({ from: 'content', name, payload }, window.location.origin)
    }else if (to === 'background') {
        chrome.runtime.sendMessage({ from: 'content', name, payload })
    }
}

export function listenMessage(from, callback) {
    if (from === 'inpage') {
        window.addEventListener('message', event => {
            if (event.source !== window || event.data.from !== from) {
                return
            }

            callback(event.data, event)
        })
    }else if (from === 'background') {
        chrome.runtime.onMessage.addListener((msg, sender) => {
            if (msg.from !== from) {
                return
            }

            callback(msg, sender)
        })
    }
}
