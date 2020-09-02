<template>
  <v-app id="inspire" :class="$vuetify.theme.dark ? 'bg-dark' : 'bg-light'">
    <v-navigation-drawer
      app
      clipped
      permanent
      :width="$vuetify.breakpoint.lgAndUp ? '430' : '356'"
      :mini-variant="!(drawer && ( $route.name === 'Index' || $route.name === 'Resource' ))"
      :mini-variant-width="$vuetify.breakpoint.lgAndUp ? '80' : '56'"
      class="no-transition"
      v-if="$route.name !== 'Auth'"
      :temporary="($vuetify.breakpoint.smAndDown && drawer)"
    >
      <div class="d-flex fill-height">
        <side-nav :drawer="drawer" @open-drawer="openDrawer" @close-drawer="closeDrawer" />
        <v-spacer></v-spacer>
        <namespace-navigator
          v-show="drawer && ( $route.name === 'Index' || $route.name === 'Resource' )"
        />
      </div>
    </v-navigation-drawer>

    <v-app-bar app clipped-left v-if="$route.name !== 'Auth'">
      <v-toolbar-title class="source-code-pro">{{ $variables.navBarTitle }}</v-toolbar-title>
    </v-app-bar>

    <v-main
      class="no-transition"
      :style="($vuetify.breakpoint.mdAndDown && drawer && ($route.name === 'Index' || $route.name === 'Resource')) ? 'margin-left: 56px;' : ''"
    >
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { Auth, Hub } from "aws-amplify";
import NamespaceNavigator from "@/components/NamespaceNavigator";
import SideNav from "@/components/SideNav";
export default {
  components: {
    NamespaceNavigator,
    SideNav,
  },
  data: () => ({
    drawer: true,
    authenticated: false,
  }),
  computed: {

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
  methods: {
    openDrawer: function () {
      var vm = this;
      vm.drawer = true;
    },
    closeDrawer: function () {
      var vm = this;
      vm.drawer = false;
    },
  },
};
</script>

<style lang="scss">
.source-code-pro {
  font-family: "Source Code Pro", monospace !important;
}

.cursor-pointer {
  cursor: pointer;
}

.title-case {
  text-transform: capitalize;
}

// vuetify text fields are too tall
.short-text-field {
  height: 60px;
}

.no-transition {
  transition: none !important;
}

// let temporary drawer sit over content but under toolbar
.v-navigation-drawer--temporary.v-navigation-drawer--clipped {
  z-index: 5;
  padding-top: 56px;
}

#inspire.bg-light {
  background-repeat: repeat;
  background-color: #eeeeee;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  /* background by SVGBackgrounds.com */

  // fix button color
  .v-btn:not(.v-btn--outlined).secondary {
    color: black;
  }
}
#inspire.bg-dark {
  background-repeat: repeat;
  background: url("../public/Tortoise-Shell-dark-bg.svg");
  /* background by SVGBackgrounds.com */
}
</style>
