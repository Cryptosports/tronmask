<template>
    <div>
        <table>
            <tr>
                <td>From</td>
                <td>{{ transferDetails.from }}</td>
            </tr>

            <tr>
                <td>To</td>
                <td>{{ transferDetails.to }}</td>
            </tr>

            <tr>
                <td>Amount</td>
                <td>{{ $formatNumber(transferDetails.amount, { maximumSignificantDigits: 7 }) }} TRX</td>
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
