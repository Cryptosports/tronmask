import { sendMessage, listenMessage } from './messaging'

// Inject inpage script to web page.
function injectScript(filepath) {
    const container = document.head || document.documentElement
    const scriptTag = document.createElement('script')

    scriptTag.setAttribute('type', 'text/javascript')
    scriptTag.setAttribute('src', filepath)

    container.insertBefore(scriptTag, container.children[0])
}

injectScript(chrome.extension.getURL('js/inpage.js'))

// Listen Inpage Messaging
listenMessage('inpage', function(msg){
    if (msg.name === 'connect') {
        sendMessage('background', 'connect', msg.payload)
        return
    }
})

// Listen Background Messaging
listenMessage('background', function(msg){
    if (msg.name === 'connect') {
        sendMessage('inpage', 'connect', msg.payload)
        return
    }
})
