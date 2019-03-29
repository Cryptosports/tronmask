import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import wallet from './modules/wallet'
import network from './modules/network'
import account from './modules/account'
import votes from './modules/votes'
import trc10 from './modules/trc10'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    modules: ['wallet', 'network', 'route']
})

export default new Vuex.Store({
    modules: {
        wallet,
        network,
        account,
        votes,
        trc10
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
