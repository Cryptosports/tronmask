export default {
    namespaced: true,

    state: {
        id: 1,
        name: 'Mainnet',
        url: 'https://api.tronscan.org',
        fullnode: 'http://api.trondapps.org',
        type: 'mainnet'
    },

    mutations: {
        change(state, network) {
            state.id = network.id
            state.name = network.name
            state.url = network.url
            state.fullnode = network.fullnode
            state.type = network.type
        }
    }
}
