<template>
    <table v-if="contract" class="notif-table">
        <tr>
            <th>Type</th>
            <td>{{ contract.type }}</td>
        </tr>

        <tr v-for="(value, key, index) in contract.parameter.value" :key="index">
            <th>{{ contractLabel(key) }}</th>
            <td>{{ contractValue(key, value) }}</td>
        </tr>
    </table>
</template>

<script>
    import tronWeb from '../../../lib/tronweb'
    import { getTokenAmount } from '../../../lib/utils'

    export default {
        props: ['contract'],

        methods: {
            contractLabel(key) {
                return key.replace(/_/g, ' ')
            },

            contractValue(key, value) {
                if (key === 'owner_address' || key === 'to_address' || key === 'asset_name') {
                    return tronWeb().address.fromHex(value)
                }

                if (key === 'frozen_balance') {
                    return getTokenAmount(value)
                }

                return value
            }
        }
    }
</script>
