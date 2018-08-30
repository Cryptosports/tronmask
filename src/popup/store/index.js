import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import wallet from './modules/wallet'
import network from './modules/network'
import account from './modules/account'
import votes from './modules/votes'
import dapps from './modules/dapps'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    modules: ['wallet', 'network', 'route', 'dapps']
})

export default new Vuex.Store({
    modules: {
        wallet,
        network,
        account,
        votes,
        dapps
    },

    state: {
        loading: false
    },

    mutations: {
        loading(state, loading) {
            state.loading = loading
        }
    },

    plugins: [vuexLocal.plugin]
})
