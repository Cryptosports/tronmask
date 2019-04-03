export default {
    namespaced: true,

    state: {
        id: 1,
        name: 'Mainnet',
        tronscan: 'https://apilist.tronscan.org',
        type: 'mainnet'
    },

    mutations: {
        change(state, network) {
            state.id = network.id
            state.name = network.name
            state.tronscan = network.tronscan
            state.type = network.type
        }
    }
}
