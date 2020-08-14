<template>
  <v-container fluid>
    <v-row justify="center" class="my-12">
      <v-col cols="12" md="10" xl="8">
        <v-card class="elevation-6 pa-6">
          <div>
            <span class="title px-2">API Token</span>
          </div>
          <div class="d-flex pt-6">
            <v-btn height="48" color="secondary" class="mr-2">regenerate</v-btn>
            <v-text-field
              class="short-text-field"
              background-color="secondary"
              solo
              single-line
              disabled
              v-model="apiToken"
            ></v-text-field>
          </div>
        </v-card>
        <v-card class="elevation-6 pa-6 mt-6">
          <div>
            <span class="title px-2">Google Chrome Extension</span>
          </div>
          <div class="d-flex pt-6">
            <span>placeholder</span>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {},
  computed: {},
  data: () => ({
    apiToken: 1234,
  }),
  methods: {
    getApiToken: function() {
      // var vm = this
    },
  },
};
</script>

<style>
</style>