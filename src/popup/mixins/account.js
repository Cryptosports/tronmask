import API from '../../lib/api'
import { mapState } from 'vuex'
import { getTokenAmount } from '../../lib/utils'

export default {
    computed: mapState({
        account: state => state.account,
        address: state => state.wallet.address,
        trc10: state => state.trc10.tokens
    }),

    methods: {
        async loadAccount() {
            const accountData = await API().getAccountByAddressNew(this.address)

            let account = {}
            account.balance = getTokenAmount(accountData.balance)
            account.bandwidth = accountData.bandwidth.netRemaining
            account.freeBandwidth = accountData.bandwidth.freeNetRemaining
            account.frozen = getTokenAmount(accountData.frozen.total)
            account.frozenExpires = (accountData.frozen.balances.length > 0) ? accountData.frozen.balances[0].expires : 0

            const tokens = accountData.tokenBalances.filter((t, i) => {
                if (t.name !== '_') {
                    return t
                }
            })

            this.$store.commit('account/change', account)
            this.$store.commit('account/tokens', tokens)

            if (this.trc10.length === 0) {
                const trc10 = await this.getTRC10()
                this.$store.commit('trc10/tokens', trc10)
            }

            this.getTRC10Details(this.trc10, 1000176)
        },

        async refreshAccount() {
            this.$store.commit('loading', true)
            await this.loadAccount()
            this.$store.commit('loading', false)
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

        getTRC10Details(trc10, tokenId, index) {
            if (trc10[tokenId] == undefined) {
                return tokenId
            }

            const details = trc10[tokenId].split(';')
            return details[index]
        }
    }
}
