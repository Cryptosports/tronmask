<template>
    <div>
        <app-header :subtitle="subtitle" :show-navigations="false" />

        <main class="main notif">
            <div v-show="message.show" class="message" :class="[ message.type ]">
                {{ message.text }}
            </div>

            <div class="notif-text">
                <div v-if="$route.params.name == 'connect'">
                    <p><strong>{{ $route.query.domain }}</strong> want to access your TRON account. It could access :</p>

                    <ul>
                        <li>Your current TRON address.</li>
                        <li>Network that you're currently connected to (mainnet or testnet).</li>
                    </ul>

                    <p>This won't let the dapp to access your private key.</p>
                </div>

                <div v-else-if="$route.params.name == 'submit_transaction' && txContract">
                    <transfer-details v-if="txContract.type === 'TransferContract'" :contract="txContract" />
                    <transfer-asset-details v-else-if="txContract.type === 'TransferAssetContract'" :contract="txContract" />
                    <freeze-details v-else-if="txContract.type === 'FreezeBalanceContract'" :contract="txContract" />
                    <votes-details v-else-if="txContract.type === 'VoteWitnessContract'" :contract="txContract" />
                    <transaction-details v-else :contract="txContract" />
                </div>

                <div v-else-if="$route.params.name == 'send_trx'">
                    <transfer-details :params="{ from: wallet.address, to: $route.query.to, amount: $route.query.amount }" />
                </div>

                <div v-else-if="$route.params.name == 'send_token'">
                    <transfer-asset-details :params="{ from: wallet.address, to: $route.query.to, amount: $route.query.amount, assetName: $route.query.tokenID }" />
                </div>
            </div>

            <div v-if="!wallet.keypass">
                <input class="input-field" type="password" placeholder="Password" v-model="password">
            </div>

            <div class="button-group">
                <div class="button-group-item">
                    <button class="button" type="button" @click.prevent="cancel($route.params.name)">Cancel</button>
                </div>
                <div class="button-group-item">
                    <button class="button brand" type="button" @click.prevent="approve($route.params.name)">Approve</button>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { decryptKeyStore } from '../../lib/keystore'
    import { getTokenRawAmount } from '../../lib/utils'
    import tronWeb from '../../lib/tronweb'
    import AppHeader from '../components/AppHeader.vue'
    import TransactionDetails from '../components/notifications/TransactionDetails.vue'
    import TransferDetails from '../components/notifications/TransferDetails.vue'
    import TransferAssetDetails from '../components/notifications/TransferAssetDetails.vue'
    import FreezeDetails from '../components/notifications/FreezeDetails.vue'
    import VotesDetails from '../components/notifications/VotesDetails.vue'

    export default {
        components: {
            AppHeader,
            TransactionDetails,
            TransferDetails,
            TransferAssetDetails,
            FreezeDetails,
            VotesDetails,
        },

        data: () => ({
            password: '',
            message: {
                show: false,
                type: 'error',
                text: ''
            },
            payload: false
        }),

        computed: {
            subtitle() {
                const subtitles = {
                    connect: 'Allow Access to Dapps'
                }

                return subtitles[this.$route.params.name] || 'Confirm Transaction'
            },
            txContract() {
                const contract = ((this.payload.tx || {}).raw_data || {}).contract || []

                return contract[0] || false
            },
            ...mapState({
                dapps: state => state.dapps,
                wallet: state => state.wallet,
                network: state => state.network
            })
        },

        mounted() {
            this.onLoaded()
            this.getPayload()
        },

        methods: {
            login() {
                if (this.wallet.keypass) {
                    return decryptKeyStore(this.wallet.keypass, this.wallet.keystore)
                }

                const wallet = decryptKeyStore(this.password, this.wallet.keystore)

                if (!wallet) {
                    this.message.show = true
                    this.message.type = 'error'
                    this.message.text = 'Password is incorrect'

                    return false
                }

                return wallet
            },

            onLoaded() {
                chrome.runtime.sendMessage({ from: 'popup', name: 'tronmask_notification_loaded' })
            },

            getPayload() {
                const listener = (msg, sender) => {
                    if (msg.from !== 'background' || msg.name !== 'tronmask_notification') {
                        return
                    }

                    this.payload = msg.payload
                    chrome.runtime.onMessage.removeListener(listener)
                }

                chrome.runtime.onMessage.addListener(listener)
            },

            getWindow(callback) {
                chrome.windows.getCurrent({ windowTypes: ['popup'], populate: true }, window => {
                    if (window.tabs[0].title === 'TronMask') {
                        callback(window)
                    }
                })
            },

            closeWindow(windowId) {
                chrome.windows.remove(windowId)
            },

            sendMessage(name, payload) {
                name = `tronmask_${name}`
                chrome.runtime.sendMessage({ from: 'popup', name, tabid: this.$route.query.tabid, payload })
            },

            cancel(page) {
                this.getWindow(window => {
                    this.sendMessage(page, {
                        status: 'error',
                        type: 'CANCELLED'
                    })
                    this.closeWindow(window.id)
                })
            },

            approve(page) {
                switch (page) {
                    case 'connect':
                        this.allowDapp()
                        break
                    case 'submit_transaction':
                        this.submitTransaction()
                        break
                    case 'send_trx':
                        this.sendTrx()
                        break
                    case 'send_token':
                        this.sendToken()
                        break
                    default:
                        break
                }
            },

            allowDapp() {
                if (!this.login()) {
                    return false
                }

                const dapp = {
                    domain: this.$route.query.domain,
                    favicon: this.$route.query.favicon
                }

                this.$store.commit('dapps/pushDapps', dapp)

                this.getWindow(window => {
                    this.sendMessage('connect', {
                        status: 'success',
                        data: {
                            address: this.wallet.address,
                            network: this.network
                        }
                    })
                    this.closeWindow(window.id)
                })
            },

            async submitTransaction() {
                if (!this.payload) {
                    return
                }

                const wallet = this.login()

                if (!wallet) {
                    return false
                }

                this.$store.commit('loading', true)

                this.message.type = 'error'
                this.message.text = 'Something went wrong while submitting the transaction'

                try {
                    const signedTx = await tronWeb().trx.sign(this.payload.tx, wallet.privateKey)
                    const response = await tronWeb().trx.sendRawTransaction(signedTx)

                    if (response.result) {
                        this.getWindow(window => {
                            this.sendMessage('submit_transaction', {
                                status: 'success',
                                data: {
                                    txID: this.payload.tx.txID
                                }
                            })
                            this.closeWindow(window.id)
                        })
                    }else {
                        this.message.show = true
                    }
                } catch (error) {
                    this.message.show = true
                }

                this.$store.commit('loading', false)
            },

            async sendTrx() {
                const wallet = this.login()

                if (!wallet) {
                    return false
                }

                this.$store.commit('loading', true)

                this.message.type = 'error'
                this.message.text = 'Something went wrong while submitting the transaction'

                try {
                    const { to, amount } = this.$route.query
                    const rawTx = await tronWeb().transactionBuilder.sendTrx(to, getTokenRawAmount(amount), wallet.address)
                    const signedTx = await tronWeb().trx.sign(rawTx, wallet.privateKey)
                    const response = await tronWeb().trx.sendRawTransaction(signedTx)

                    if (response.result) {
                        this.getWindow(window => {
                            this.sendMessage('send_trx', {
                                status: 'success',
                                data: {
                                    txID: rawTx.txID
                                }
                            })
                            this.closeWindow(window.id)
                        })
                    }else {
                        this.message.show = true
                    }
                } catch (error) {
                    this.message.text = error.replace('class org.tron.core.exception.ContractValidateException : ', '')
                    this.message.show = true
                }

                this.$store.commit('loading', false)
            },

            async sendToken() {
                const wallet = this.login()

                if (!wallet) {
                    return false
                }

                this.$store.commit('loading', true)

                this.message.type = 'error'
                this.message.text = 'Something went wrong while submitting the transaction'

                try {
                    const { to, amount, tokenID } = this.$route.query
                    const rawTx = await tronWeb().transactionBuilder.sendToken(to, amount, tokenID, wallet.address)
                    const signedTx = await tronWeb().trx.sign(rawTx, wallet.privateKey)
                    const response = await tronWeb().trx.sendRawTransaction(signedTx)

                    if (response.result) {
                        this.getWindow(window => {
                            this.sendMessage('send_token', {
                                status: 'success',
                                data: {
                                    txID: rawTx.txID
                                }
                            })
                            this.closeWindow(window.id)
                        })
                    }else {
                        this.message.show = true
                    }
                } catch (error) {
                    this.message.text = error.replace('class org.tron.core.exception.ContractValidateException : ', '')
                    this.message.show = true
                }

                this.$store.commit('loading', false)
            }
        }
    }
</script>

<style>
    .main.notif {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
    }
    .notif-text {
        font-size: 0.875rem;
    }
    .notif-text ul {
        padding-left: 1.25rem;
    }
    .notif-table {
        width: 100%;
        margin: 1rem 0;
        border-collapse: collapse;
        font-size: 0.75rem;
    }
    .notif-table tr {
        background: #EEEEEE;
        border-top: 1px solid #E0E0E0;
        border-bottom: 1px solid #E0E0E0;
    }
    .notif-table tr:nth-child(even) {
        background: #F5F5F5;
    }
    .notif-table th,
    .notif-table td {
        padding: 0.75rem 0.5rem;
    }
    .notif-table th {
        font-weight: 600;
        text-align: left;
        text-transform: capitalize;
    }
    .notif .button-group {
        padding-bottom: 1rem;
    }
    .notif-subtile {
        font-size: 0.75rem;
        text-transform: uppercase;
        margin: 1rem 0 0.75rem;
        padding: 0 0.25rem;
    }
</style>

