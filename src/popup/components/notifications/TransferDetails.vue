<template>
    <table class="notif-table">
        <tr>
            <th>From</th>
            <td>{{ transferDetails.from }}</td>
        </tr>

        <tr>
            <th>To</th>
            <td>{{ transferDetails.to }}</td>
        </tr>

        <tr>
            <th>Amount</th>
            <td>{{ $formatNumber(transferDetails.amount, { maximumSignificantDigits: 7 }) }} TRX</td>
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
                        from: tronWeb().fromHex(this.contract.parameter.value.owner_address),
                        to: tronWeb().fromHex(this.contract.parameter.value.to_address),
                        amount: tronWeb().sunToTrx(this.contract.parameter.value.amount)
                    }
                }

                return this.params
            }
        }
    }
</script>
