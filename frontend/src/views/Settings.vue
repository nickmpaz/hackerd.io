<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="10" xl="8">
        <h1 class="source-code-pro mb-6">Settings</h1>
        <v-card class="elevation-6">
          <v-row>
            <v-col cols="6">
              <div class="mx-5 mt-5 mb-8">
                <span class="title">Appearances</span>
              </div>
              <v-switch
                v-model="$vuetify.theme.dark"
                @change="setDarkModePreference()"
                primary
                label="Dark Mode"
                class="mx-5"
              />
            </v-col>
            <v-col cols="6"></v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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