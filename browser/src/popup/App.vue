<template>
  <v-app>
    <div id="popup" class="d-flex flex-column">
      <div>
        <v-toolbar>
          <v-toolbar-title>Stashable.io</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon v-if="mode === 'link'" @click="mode = 'token'">
            <v-icon>mdi-lock</v-icon>
          </v-btn>
          <v-btn icon v-if="mode === 'token' && apiToken" @click="mode = 'link'">
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </v-toolbar>
      </div>
      <div class="pa-6 flex-grow-1">
        <link-page v-if="mode === 'link'" :apiToken="apiToken" />
        <token-page v-if="mode === 'token'" @set-api-token="setApiToken" :apiToken="apiToken" />
      </div>
    </div>
  </v-app>
</template>

<script>
import LinkPage from "../components/LinkPage";
import TokenPage from "../components/TokenPage";
export default {
  name: "App",

  components: { LinkPage, TokenPage },
  created() {
    var vm = this;
    vm.getApiToken();
  },
  data: () => ({
    apiToken: null,
    mode: "link",
    content: "",
    title: "",
  }),
  methods: {
    getApiToken: function () {
      var vm = this;
      chrome.storage.sync.get(["apiToken"], function (result) {
        console.log("Value currently is " + result.apiToken);
        vm.apiToken = result.apiToken;
        if (!vm.apiToken) vm.mode = "token";
      });
    },
    setApiToken: function (apiToken) {
      var vm = this;
      vm.mode = "link";
      chrome.storage.sync.set({ apiToken: apiToken }, function () {
        vm.apiToken = apiToken;
        console.log("Value is set");
      });
    },
  },
};
</script>

<style lang="scss">
#popup {
  height: 400px;
  width: 600px;
}

.short-text-field {
  height: 55px;
}
</style>