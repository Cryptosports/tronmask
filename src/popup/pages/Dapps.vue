<template>
    <div>
        <app-header />

        <main class="main">
            <div v-if="dappsList.length === 0" class="message-empty">
                No dapps yet
            </div>

            <div v-else>
                <div>
                    <div class="dapp" v-for="dapp in dappsList" :key="dapp.id">
                        <external-link :url="getDappUrl(dapp)" class="dapp-link">
                            <span class="dapp-icon"><img :src="getDappIcon(dapp)"></span>
                            <span class="dapp-domain">{{ dapp.domain }}</span>
                        </external-link>

                        <a href="#" class="dapp-remove" @click.prevent="removeDapp(dapp)">
                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import AppHeader from '../components/AppHeader.vue'
    import ExternalLink from '../components/ExternalLink.vue'

    export default {
        components: {
            AppHeader,
            ExternalLink
        },

        computed: {
            dappsList() {
                return this.dapps.map((d, i) => ({
                    ...d,
                    id: i + 1
                }))
            },
            ...mapState({
                dapps: state => state.dapps.dapps,
            })
        },

        methods: {
            getDappUrl(dapp) {
                try {
                    const url = new URL(dapp.favicon)
                    return url.origin
                } catch (error) {
                    return `http://${dapp.domain}`
                }
            },

            getDappIcon(dapp) {
                return (dapp.favicon != '') ? dapp.favicon : 'icons/16.png'
            },

            removeDapp(dapp) {
                const dapps = this.dapps.filter(d => d.domain !== dapp.domain)
                console.log(dapps)

                this.$store.commit('dapps/dapps', dapps)
            }
        }
    }
</script>

<style>
    .dapp {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.5s ease;
        background: #FFFFFF;
        border-radius: 5px;
        padding: 0;
        margin-bottom: 0.75rem;
        font-size: 0.875rem;
    }
    .dapp:hover,
    .dapp:focus {
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    }
    .dapp a {
        color: #424242;
        padding: 0.75rem;
    }
    .dapp a:hover {
        color: #D32F2F;
    }
    .dapp-link {
        display: flex;
        align-items: center;
        flex: 1;
    }
    .dapp-icon {
        padding-right: 0.5rem;
        line-height: 1;
    }
    .dapp-domain {
        text-transform: uppercase;
        font-weight: 600;
    }
    .dapp-remove {
        display: block;
    }
</style>

