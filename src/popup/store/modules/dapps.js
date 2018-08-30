export default {
    namespaced: true,

    state: {
        dapps: [],
    },

    mutations: {
        dapps(state, dapps) {
            state.dapps = dapps
        },

        pushDapps(state, dapp) {
            state.dapps.push(dapp)
        }
    }
}
