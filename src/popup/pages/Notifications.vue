<template>
    <div>
        <app-header :subtitle="subtitle" :show-navigations="false" />

        <main class="main"></main>
    </div>
</template>

<script>
    import AppHeader from '../components/AppHeader.vue'

    export default {
        components: {
            AppHeader
        },

        computed: {
            subtitle() {
                const subtitles = {
                    connect: 'Allow Access to Dapps'
                }

                return subtitles[this.$route.params.name] || 'Confirm Transaction'
            },
        }
    }
</script>

