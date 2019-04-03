import API from '../../lib/api'
import { mapState } from 'vuex'
import { getTokenAmount } from '../../lib/utils'

export default {
    computed: mapState({
        trc10: state => state.trc10.tokens
    }),

    methods: {
        getTokenAmount,

        async loadTokenData() {
            const tokenData = await API().getTokens({ showAll: 1, limit: 1 })

            if (tokenData.total > Object.keys(this.trc10).length) {
                const trc10 = await this.getTRC10()
                this.$store.commit('trc10/tokens', trc10)
            }
        },

        async getTRC10() {
            let tokens = {}
            const data = await API().getTokens({ showAll: 1, limit: 4000 })

            for (var i = 0; i < data.tokens.length; i++) {
                if (!tokens[data.tokens[i].id]) {
                    tokens[data.tokens[i].id] = data.tokens[i].name + ';' + data.tokens[i].abbr + ';' + data.tokens[i].precision
                }
            }

            return tokens
        },

        getTRC10Details(tokenId) {
            if (this.trc10[tokenId] == undefined) {
                return ['TOKEN', 'TOKEN', '0']
            }

            return this.trc10[tokenId].split(';')
        }
    }
}
