<template>
    <div>
        <table class="notif-table">
            <tr>
                <th>Type</th>
                <td>Vote Representatives</td>
            </tr>

            <tr>
                <th>Address</th>
                <td>{{ transferDetails.address }}</td>
            </tr>
        </table>

        <h3 class="notif-subtile">Votes</h3>

        <table class="notif-table">
            <tr v-for="(value, key, index) in transferDetails.votes" :key="index">
                <td>{{ fromHex(value.vote_address) }}</td>
                <td>
                    {{ $formatNumber(value.vote_count, { maximumSignificantDigits: 7 }) }}
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    import tronWeb from '../../../lib/tronweb'

    export default {
        props: {
            contract: { default: false },
            params: { default: false }
        },

        computed: {
            transferDetails() {
                if (this.contract) {
                    return {
                        address: this.fromHex(this.contract.parameter.value.owner_address),
                        votes: this.contract.parameter.value.votes
                    }
                }

                return this.params
            }
        },

        methods: {
            fromHex(address) {
                return tronWeb().address.fromHex(address)
            }
        }
    }
</script>
