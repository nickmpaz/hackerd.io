<template>
  <v-app id="inspire" :class="$vuetify.theme.dark ? 'bg-dark' : 'bg-light'">
    <v-navigation-drawer
      v-if="authenticated"
      v-model="drawer"
      app
      clipped
      disable-route-watcher
      disable-resize-watcher
      width="300"
      class="pa-2"
    >
      <div class="d-flex flex-row-reverse py-1">
        <v-btn @click="openItems = []" x-small color="transparent" depressed>
          <v-icon class="py-4">mdi-minus</v-icon>
        </v-btn>
        <v-btn @click="openItems = []" x-small color="transparent" depressed>
        <v-icon >mdi-folder</v-icon>
        </v-btn>
        <v-btn @click="openItems = []" x-small color="transparent" depressed>
          <v-icon class>mdi-note</v-icon>
        </v-btn>
        <v-btn @click="openItems = []" x-small color="transparent" depressed>
          <v-icon class>mdi-link-variant</v-icon>
        </v-btn>
      </div>
      <hr class="my-2" />
      <v-treeview dense hoverable activatable :items="items" :open="openItems" expand-icon="mdi-chevron-down"></v-treeview>
    </v-navigation-drawer>

    <v-app-bar app clipped-left v-if="$route.name !== 'Auth'">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-container fluid class="d-flex align-center">
        <v-toolbar-title
          class="cursor-pointer"
          @click="$router.push({name: 'Index'})"
        >{{ navBarTitle }}</v-toolbar-title>
        <div class="ml-auto">
          <v-menu bottom offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" class="mt-1">
                <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-account-circle-outline</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item link @click="$router.push({name: 'Index'})">
                <v-list-item-action>
                  <v-icon>mdi-view-dashboard</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Dashboard</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item link @click="$router.push({name: 'Settings'})">
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
          </v-menu>
        </div>
      </v-container>
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
    authenticated: false,
    openItems: [],
    items: [
      {
        id: 1,
        name: "Applications :",
        children: [
          { id: 2, name: "Calendar : app" },
          { id: 3, name: "Chrome : app" },
          { id: 4, name: "Webstorm : app" },
        ],
      },
      {
        id: 5,
        name: "Documents :",
        children: [
          {
            id: 6,
            name: "vuetify :",
            children: [
              {
                id: 7,
                name: "src :",
                children: [
                  { id: 8, name: "index : ts" },
                  { id: 9, name: "bootstrap : ts" },
                ],
              },
            ],
          },
          {
            id: 10,
            name: "material2 :",
            children: [
              {
                id: 11,
                name: "src :",
                children: [
                  { id: 12, name: "v-btn : ts" },
                  { id: 13, name: "v-card : ts" },
                  { id: 14, name: "v-window : ts" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 15,
        name: "Downloads :",
        children: [
          { id: 16, name: "October : pdf" },
          { id: 17, name: "November : pdf" },
          { id: 18, name: "Tutorial : html" },
        ],
      },
      {
        id: 19,
        name: "Videos :",
        children: [
          {
            id: 20,
            name: "Tutorials :",
            children: [
              { id: 21, name: "Basic layouts : mp4" },
              { id: 22, name: "Advanced techniques : mp4" },
              { id: 23, name: "All about app : dir" },
            ],
          },
          { id: 24, name: "Intro : mov" },
          { id: 25, name: "Conference introduction : avi" },
        ],
      },
    ],
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
  methods: {
    signOut: function () {
      Auth.signOut();
    },
  },
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
