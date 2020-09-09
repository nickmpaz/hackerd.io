<template>
  <div class="d-flex flex-column fill-height">
    <div class="flex-grow-1">
      <v-text-field
        v-model="apiTokenInput"
        class="short-text-field"
        label="API Token"
        single-line
        solo
      ></v-text-field>
    </div>
    <div class="d-flex">
      <v-spacer></v-spacer>
      <v-btn @click="setApiToken" color="success" :loading="loading">Set Token</v-btn>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["apiToken"],
  data: () => ({
    apiTokenInput: "",
    loading: false,
  }),
  created() {
    //   var vm = this
    this.apiTokenInput = this.apiToken;
  },
  methods: {
    setApiToken: function () {
      var vm = this;
      console.log(vm.apiTokenInput)
      vm.loading = true;
      axios({
        method: "post",
        url: `${vm.$variables.api}external/ping_auth`,
        data: {
          apiToken: vm.apiTokenInput,
        },
      })
        .then((response) => {
          console.log(response);
          vm.loading = false
          vm.$emit("set-api-token", vm.apiTokenInput);
        })
        .catch((err) => {
          vm.loading = false
          vm.apiTokenInput = ""
          console.error(err);
        });
    },
  },
};
</script>

<style lang="scss">
</style>