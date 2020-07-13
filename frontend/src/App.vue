<template>
<v-app id="inspire">
    <v-navigation-drawer v-if="authenticated" v-model="drawer" app clipped disable-route-watcher disable-resize-watcher>
        <v-list dense>
            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-view-dashboard</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Dashboard</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link>
                <v-list-item-action>
                    <v-icon>mdi-cog</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Settings</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link @click.stop="signOut">
                <v-list-item-action>
                    <v-icon>mdi-logout</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>Sign Out</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
        <v-app-bar-nav-icon v-if="authenticated" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
        <router-view />
    </v-main>

</v-app>
</template>

<script>
import {
    Auth, Hub
} from 'aws-amplify'

export default {
    data: () => ({
        drawer: false,
        authenticated: false,
    }),
    beforeCreate() {
        // change authenticated variable when auth state changes
        Hub.listen('auth', (data) => {
            console.log('A new auth event has happened: ' + data.payload.event);
            if (data.payload.event === 'signIn') {
                this.authenticated = true
            }
            if (data.payload.event === 'signOut') {
                this.authenticated = false
            }
        })
        // set authenticated variable on page landing
        Auth.currentAuthenticatedUser()
            .then(() => this.authenticated = true)
            .catch(() => {
                this.authenticated = false
            })
    },
    created() {
        // this.$vuetify.theme.dark = true
    },
    methods: {
        signOut: async function() {
            await Auth.signOut()
            this.drawer = false;
            this.$router.push({name: "Auth"});
        },
    }
}
</script>
