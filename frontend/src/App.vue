<template>
  <v-app id="inspire" :class="$vuetify.theme.dark ? 'bg-dark' : 'bg-light'">
    <v-app-bar app clipped-left v-if="$route.name !== 'Auth'">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-container fluid class="d-flex align-center">
        <v-toolbar-title>{{ navBarTitle }}</v-toolbar-title>
        <div class="ml-auto">
          <user-options />
        </div>
      </v-container>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      disable-route-watcher
      disable-resize-watcher
      width="300"
      class="pa-2"
      v-show="$route.name !== 'Auth'"
    >
      <namespace-navigator />
    </v-navigation-drawer>

    <v-main>
      <router-view :drawer="drawer" />
    </v-main>
  </v-app>
</template>

<script>
import { Auth, Hub } from "aws-amplify";
import UserOptions from "./components/UserOptions";
import NamespaceNavigator from "./components/NamespaceNavigator";

export default {
  components: {
    UserOptions,
    NamespaceNavigator,
  },
  data: () => ({
    drawer: true,
    authenticated: false,
  }),
  computed: {
    navBarTitle() {
      var vm = this;
      var stageIndicator = vm.$variables.stageIndicator
        ? " " + vm.$variables.stageIndicator
        : "";
      return vm.$variables.brand + stageIndicator;
    },
  },
  beforeCreate() {
    document.title = this.$variables.brand;
    // change authenticated variable when auth state changes
    Hub.listen("auth", (data) => {
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
      this.$vuetify.theme.dark = JSON.parse(
        localStorage.getItem("darkModePreference")
      );
    } else {
      this.$vuetify.theme.dark = this.$variables.darkModeDefault;
    }
  },
  methods: {},
};
</script>

<style lang="scss">
.cursor-pointer {
  cursor: pointer;
}

.title-case {
  text-transform: capitalize;
}

#inspire.bg-light {
  background-repeat: repeat;
  background: url("./assets/lightmode-background.svg");
  /* background by SVGBackgrounds.com */
}
#inspire.bg-dark {
  background-repeat: repeat;
  background: url("../public/Tortoise-Shell-dark-bg.svg");
  /* background by SVGBackgrounds.com */
}
</style>
