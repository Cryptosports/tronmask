<template>
    <table>
        <tr>
            <td>Type</td>
            <td>{{ contract.type }}</td>
        </tr>

        <tr v-for="(value, key, index) in contract.parameter.value" :key="index">
            <td>{{ key }}</td>
            <td>{{ value }}</td>
        </tr>
    </table>
</template>

<script>
    export default {
        props: ['contract']
    }
</script>
