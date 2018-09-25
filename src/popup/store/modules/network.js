export default {
    namespaced: true,

    state: {
        id: 1,
        name: 'Mainnet',
        url: 'https://api.tronscan.org',
        fullNode: 'http://api.trondapps.org',
        solidityNode: 'http://api.trondapps.org',
        eventServer: 'http://api.trondapps.org',
        type: 'mainnet'
    },

    mutations: {
        change(state, network) {
            state.id = network.id
            state.name = network.name
            state.url = network.url
            state.fullNode = network.fullNode
            state.solidityNode = network.solidityNode
            state.eventServer = network.eventServer
            state.type = network.type
        }
    }
}
