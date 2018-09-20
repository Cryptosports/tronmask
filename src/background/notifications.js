export default {
    queryString(params) {
        let i = 0
        let query = ''
        for (const key in params) {
            if (i > 0) {
                query += '&'
            }else {
                query += '?'
            }

            query += `${key}=${params[key]}`
            i++
        }

        return query
    },

    show(name, params, tabid) {
        params = { tabid, ...params }
        const query = this.queryString(params)

        chrome.windows.create({
            url: `/popup.html#/notifications/${name}${query}`,
            type: 'popup',
            width: 370,
            height: 600
        })
    },

    sendPayload(payload) {
        this.onLoaded(() => {
            chrome.runtime.sendMessage({ from: 'background', name: 'tronmask_notification', payload })
        })
    },

    onLoaded(callback) {
        const listener = (msg, sender) => {
            if (msg.from !== 'popup' || msg.name !== 'tronmask_notification_loaded') {
                return
            }

            callback(msg, sender)
            chrome.runtime.onMessage.removeListener(listener)
        }

        chrome.runtime.onMessage.addListener(listener)
    }
}
