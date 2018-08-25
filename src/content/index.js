// Inject inpage script to web page.
function injectScript(file_path) {
    const container = document.head || document.documentElement
    const scriptTag = document.createElement('script')

    scriptTag.setAttribute('type', 'text/javascript')
    scriptTag.setAttribute('src', file_path)

    container.insertBefore(scriptTag, container.children[0])
}

injectScript(chrome.extension.getURL('js/inpage.js'))
