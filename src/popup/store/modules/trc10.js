export default {
    namespaced: true,

    state: {
        tokens: []
    },

    mutations: {
        tokens(state, tokens) {
            state.tokens = tokens
        }
    }
}
