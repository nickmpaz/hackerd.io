<template>
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
</template>

<script>
import { Auth } from "aws-amplify";

export default {
  methods: {
    signOut: function () {
      Auth.signOut();
    },
  },
};
</script>