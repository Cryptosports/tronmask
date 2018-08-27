export function showNotifications(name) {
    chrome.windows.create({
        url: `/popup.html#/notifications/${name}`,
        type: 'popup',
        width: 370,
        height: 600,
        left: screen.width
    })
}
