import messaging from './messaging'

// Inject inpage script to web page.
function injectScript(filepath) {
    const container = document.head || document.documentElement
    const scriptTag = document.createElement('script')

    scriptTag.setAttribute('type', 'text/javascript')
    scriptTag.setAttribute('src', filepath)

    container.insertBefore(scriptTag, container.children[0])
}

messaging.sendBackground('tronmask_wallet_available', {}, msg => {
    if (msg.payload.status === 'success') {
        injectScript(chrome.extension.getURL('js/inpage.js'))
    }
})


// Listen Inpage Messaging
messaging.listenInpage(inpageMsg => {
    messaging.sendBackground(inpageMsg.name, inpageMsg.payload, backgroundMsg => {
        messaging.postInpage(inpageMsg.name, backgroundMsg.payload)
    })
})
