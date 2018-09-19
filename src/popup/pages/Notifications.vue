<template>
    <div>
        <app-header :subtitle="subtitle" :show-navigations="false" />

        <main class="main notif">
            <div class="notif-text">
                <div v-if="$route.params.name == 'connect'">
                    <p><strong>{{ $route.query.domain }}</strong> want to access your TRON account. It could access :</p>

                    <ul>
                        <li>Your current TRON address.</li>
                        <li>Network that you're currently connected to (mainnet or testnet).</li>
                    </ul>

                    <p>This won't let the dapp to access your private key.</p>
                </div>

                <div v-else-if="$route.params.name == 'submit-transaction' && txContract">
                    <transfer-details v-if="txContract.type === 'TransferContract'" :contract="txContract" />
                    <transfer-asset-details v-else-if="txContract.type === 'TransferAssetContract'" :contract="txContract" />
                    <freeze-details v-else-if="txContract.type === 'FreezeBalanceContract'" :contract="txContract" />
                    <votes-details v-else-if="txContract.type === 'VoteWitnessContract'" :contract="txContract" />
                    <transaction-details v-else :contract="txContract" />
                </div>
            </div>

            <div v-if="!wallet.keypass">
                <div v-show="message.show" class="message" :class="[ message.type ]">
                    {{ message.text }}
                </div>

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
                    return true
                }

                const wallet = decryptKeyStore(this.password, this.wallet.keystore)

                if (!wallet) {
                    this.message.show = true
                    this.message.type = 'error'
                    this.message.text = 'Password is incorrect'

                    return false
                }

                return true
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
                const payload = {
                    status: 'error',
                    type: 'CANCELLED'
                }

                this.getWindow(window => {
                    this.sendMessage(page, payload)
                    this.closeWindow(window.id)
                })
            },

            approve(page) {
                switch (page) {
                    case 'connect':
                        this.allowDapp()
                        break
                    case 'submit-transaction':
                        this.submitTransaction()
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

                const payload = {
                    status: 'success',
                    data: {
                        address: this.wallet.address,
                        network: this.network
                    }
                }

                this.getWindow(window => {
                    this.sendMessage('connect', payload)
                    this.closeWindow(window.id)
                })
            },

            submitTransaction() {
                if (!this.payload) {
                    return
                }

                //
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
        margin: 1.5rem 0 0.75rem;
        padding: 0 0.25rem;
    }
</style>

