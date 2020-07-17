<template>
  <v-app id="inspire" :class="$vuetify.theme.dark ? 'bg-dark' : 'bg-light'">
    <v-navigation-drawer
      v-if="authenticated"
      v-model="drawer"
      app
      clipped
      disable-route-watcher
      disable-resize-watcher
    >
      <v-list dense>
        <v-list-item link @click="drawer = false; $router.push({name: 'Index'})">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="drawer = false; $router.push({name: 'Settings'})">
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-power-plug</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Integrations</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="signOut">
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Sign Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left v-if="authenticated">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title
        class="cursor-pointer"
        @click="$router.push({name: 'Index'})"
      >{{ navBarTitle }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { Auth, Hub } from "aws-amplify";

export default {
  data: () => ({
    drawer: false,
    authenticated: false
  }),
  computed: {
    navBarTitle() {
      var vm = this;
      var stageIndicator = vm.$variables.stageIndicator
        ? " " + vm.$variables.stageIndicator
        : "";
      return vm.$variables.brand + stageIndicator;
    }
  },
  beforeCreate() {
    // change authenticated variable when auth state changes
    Hub.listen("auth", data => {
      console.log("A new auth event has happened: " + data.payload.event);
      if (data.payload.event === "signIn") {
        this.authenticated = true;
      }
      if (data.payload.event === "signOut") {
        this.authenticated = false;
      }
    });
    // set authenticated variable on page landing
    Auth.currentAuthenticatedUser()
      .then(() => (this.authenticated = true))
      .catch(() => {
        this.authenticated = false;
      });
  },
  created() {
    // handle dark mode preference
    if (localStorage.getItem("darkModePreference")) {
      console.log(
        "Found dark mode preference: " +
          localStorage.getItem("darkModePreference")
      );
      this.$vuetify.theme.dark = JSON.parse(
        localStorage.getItem("darkModePreference")
      );
    } else {
      console.log("Did not find dark mode preference. Setting to default.");
      this.$vuetify.theme.dark = this.$variables.darkModeDefault;
    }
  },
  methods: {
    signOut: async function() {
      await Auth.signOut();
      this.drawer = false;
      this.$router.push({ name: "Auth" });
    }
  }
};
</script>

<style>
.cursor-pointer {
  cursor: pointer;
}
#inspire.bg-light {
  background-repeat: repeat;
  background: url("../public/Tortoise-Shell-light-bg-inverted.svg");
  /* background by SVGBackgrounds.com */
}
#inspire.bg-dark {
  background-repeat: repeat;
  background: url("../public/Tortoise-Shell-dark-bg.svg");
  /* background by SVGBackgrounds.com */
}
</style>