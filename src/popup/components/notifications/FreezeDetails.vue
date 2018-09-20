<template>
    <table class="notif-table">
        <tr>
            <th>Type</th>
            <td>Freeze Balance</td>
        </tr>

        <tr>
            <th>Address</th>
            <td>{{ transferDetails.address }}</td>
        </tr>

        <tr>
            <th>Amount</th>
            <td>{{ $formatNumber(transferDetails.amount, { maximumSignificantDigits: 7 }) }} TRX</td>
        </tr>

        <tr>
            <th>Duration</th>
            <td>{{ transferDetails.duration }} days</td>
        </tr>
    </table>
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
                        address: tronWeb().fromHex(this.contract.parameter.value.owner_address),
                        amount: tronWeb().sunToTrx(this.contract.parameter.value.frozen_balance),
                        duration: this.contract.parameter.value.frozen_duration
                    }
                }

                return this.params
            }
        }
    }
</script>
