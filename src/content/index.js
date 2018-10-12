import messaging from './messaging'

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
messaging.listenInpage(inpageMsg => {
    const methods = [
        'tronmask_connect',
        'tronmask_get_account',
        'tronmask_get_balance',
        'tronmask_submit_transaction',
        'tronmask_send_trx',
        'tronmask_send_token',
    ]

    if (methods.includes(inpageMsg.name)) {
        messaging.sendBackground(inpageMsg.name, inpageMsg.payload, backgroundMsg => {
            messaging.postInpage(inpageMsg.name, backgroundMsg.payload)
        })
    }
})
