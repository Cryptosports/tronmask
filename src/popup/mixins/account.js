import API from '../../lib/api'
import { mapState } from 'vuex'
import { getTokenAmount } from '../../lib/utils'
import token from './token'

export default {
    mixins: [token],

    computed: mapState({
        account: state => state.account,
        address: state => state.wallet.address
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

            const tokens = accountData.tokenBalances

            this.$store.commit('account/change', account)
            this.$store.commit('account/tokens', tokens)

            await this.loadTokenData()
        },

        async refreshAccount() {
            this.$store.commit('loading', true)
            await this.loadAccount()
            this.$store.commit('loading', false)
        },
    }
}
