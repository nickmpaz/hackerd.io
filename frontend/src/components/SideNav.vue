<template>
  <div>
    <confirm-dialog
      :active="signOutDialog"
      prompt="Sign Out?"
      confirmMessage="Continue"
      declineMessage="Cancel"
      @confirm="signOut"
      @decline="signOutDialog = false"
    />
    <v-navigation-drawer
      permanent
      mini-variant
      :mini-variant-width="width"
    >
      <v-list :dense="$vuetify.breakpoint.lgAndDown" nav>
        <v-list-item
          v-if="$route.name !== 'Index' && $route.name !== 'Resource'"
          link
          @click="$router.push({name: 'Index'})"
        >
          <v-list-item-action>
            <v-icon
              :large="$vuetify.breakpoint.lgAndUp"
              :color="( $route.name === 'Index' || $route.name === 'Resource' ) ? 'primary' : ''"
            >mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else-if="drawer" link @click="$emit('close-drawer')">
          <v-list-item-action>
            <v-icon
              :large="$vuetify.breakpoint.lgAndUp"
              :color="( $route.name === 'Index' || $route.name === 'Resource' ) ? 'primary' : ''"
            >mdi-chevron-double-left</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else link @click="$emit('open-drawer')">
          <v-list-item-action>
            <v-icon
              :large="$vuetify.breakpoint.lgAndUp"
              :color="( $route.name === 'Index' || $route.name === 'Resource' ) ? 'primary' : ''"
            >mdi-chevron-double-right</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- <v-list-item link @click="$router.push({name: 'Daily'})">
          <v-list-item-action>
            <v-icon
              :large="$vuetify.breakpoint.lgAndUp"
              :color="$route.name === 'Daily' ? 'primary' : ''"
            >mdi-calendar</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->
        <v-list-item link @click="$router.push({name: 'Integrations'})">
          <v-list-item-action>
            <v-icon
              :large="$vuetify.breakpoint.lgAndUp"
              :color="$route.name === 'Integrations' ? 'primary' : ''"
            >mdi-power-plug</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="$router.push({name: 'Settings'})">
          <v-list-item-action>
            <v-icon
              :large="$vuetify.breakpoint.lgAndUp"
              :color="$route.name === 'Settings' ? 'primary' : ''"
            >mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="signOutDialog = true">
          <v-list-item-action>
            <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import ConfirmDialog from "@/components/ConfirmDialog";

export default {
  props: ["drawer", "width"],
  components: {
    ConfirmDialog,
  },
  data: () => ({
    signOutDialog: false,
  }),
  methods: {
    signOut: function () {
      Auth.signOut();
    },
  },
};
</script>