<template>
  <div>
    <h1 class="source-code-pro mb-6">Settings</h1>
    <v-card class="elevation-6 pa-6">
      <v-row>
        <v-col cols="12" md="6">
          <span class="title">Appearances</span>
          <hr class="mt-1" />
          <v-switch
            v-model="$vuetify.theme.dark"
            @change="setDarkModePreference()"
            primary
            label="Dark Mode"
          >
            <template v-slot:label>
              <span class="ml-2">Dark Mode</span>
            </template>
          </v-switch>
        </v-col>
        <v-col cols="12" md="6"></v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  methods: {
    setDarkModePreference() {
      localStorage.setItem(
        "darkModePreference",
        JSON.stringify(this.$vuetify.theme.dark)
      );
    },
  },
};
</script>

<style>
</style>