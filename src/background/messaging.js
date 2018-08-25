export function sendMessage(to, name, payload) {
    if (to === 'content') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { from: 'background', name, payload })
        })
    }else if (to === 'popup') {
        chrome.runtime.sendMessage({ from: 'background', name, payload })
    }
}

export function listenMessage(from, callback) {
    chrome.runtime.onMessage.addListener((msg, sender) => {
        if (msg.from !== from) {
            return
        }

        callback(msg, sender)
    })
}
