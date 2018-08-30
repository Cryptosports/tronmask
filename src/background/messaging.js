export default {
    postContent(name, payload, tabid) {
        name = `${name}_response`
        chrome.tabs.sendMessage(parseInt(tabid), { from: 'background', name, payload })
    },

    listen(from, callback) {
        chrome.runtime.onMessage.addListener((msg, sender) => {
            if (msg.from !== from) {
                return
            }

            callback(msg, sender)
        })
    }
}
