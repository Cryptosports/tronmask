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
            <td>{{ $formatNumber(transferDetails.amount, { maximumSignificantDigits: 7 }) }} {{ transferDetails.assetName }}</td>
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
                        from: tronWeb().address.fromHex(this.contract.parameter.value.owner_address),
                        to: tronWeb().address.fromHex(this.contract.parameter.value.to_address),
                        assetName: tronWeb().toUtf8(this.contract.parameter.value.asset_name),
                        amount: this.contract.parameter.value.amount
                    }
                }

                return this.params
            }
        }
    }
</script>
