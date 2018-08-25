export function sendMessage(name, payload) {
    window.postMessage({ from: 'inpage', name, payload }, window.location.origin)
}

export function listenMessage(name, callback) {
    window.addEventListener('message', event => {
        if (event.source !== window || event.data.from !== 'content' || event.data.name !== name) {
            return
        }

        callback(event.data, event)
    })
}
