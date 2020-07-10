<template>
<v-container class="fill-height">
    <v-row justify="center">
    <v-btn @click.stop="federatedSignIn" :loading="loading">Sign in with Google</v-btn>
    </v-row>
</v-container>
</template>

<script>
import {
    Auth
} from 'aws-amplify'

export default {
    data: () => ({
        loading: false,
    }),
    methods: {
        federatedSignIn: function() {
            this.loading = true
            Auth.federatedSignIn({
                provider: "Google"
            })
        }
    }
}
</script>
