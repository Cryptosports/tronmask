export default {
    post(name, payload) {
        window.postMessage({ from: 'inpage', name, payload }, '*')
    },

    listen(name, callback) {
        const listener = event => {
            if (event.origin !== window.location.origin || event.data.from !== 'content' || event.data.name !== name) {
                return
            }

            callback(event.data, event)
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
