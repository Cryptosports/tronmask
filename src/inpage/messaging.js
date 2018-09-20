export default {
    post(name, payload) {
        window.postMessage({ from: 'inpage', name, payload }, '*')
    },

    listen(name, callback) {
        const listener = event => {
            const msg = event.data || {}

            if (event.origin !== window.location.origin || msg.from !== 'content' || msg.name !== name) {
                return
            }

            callback(msg, event)
            window.removeEventListener('message', listener)
        }

        window.addEventListener('message', listener)
    },

    send(name, payload, callback) {
        name = `tronmask_${name}`

        this.post(name, payload)

        this.listen(`${name}_response`, msg => {
            callback(msg.payload)
        })
    }
}
