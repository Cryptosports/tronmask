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
    }
}
