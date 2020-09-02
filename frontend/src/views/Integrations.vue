<template>
  <v-container fluid>
    <loading-dialog :active="loading" message="Loading" />
    <loading-dialog :active="generating" message="Generating API Token" />

    <v-row justify="center">
      <v-col cols="12" md="10" xl="8">
        <h1 class="source-code-pro mb-6">Integrations</h1>
        <v-card class="elevation-6 pa-6">
          <div>
            <span class="title px-2">API Token</span>
          </div>
          <div class="d-flex pt-6 px-2">
            <span>Use this token to connect {{ $variables.brand }} integrations to your account.</span>
          </div>
          <div class="d-flex pt-6">
            <v-btn height="48" width="150" color="secondary" class="mr-2" @click="regenerateApiToken">regenerate</v-btn>
            <v-text-field
              class="short-text-field"
              background-color="secondary"
              solo
              single-line
              readonly
              v-model="apiToken"
              append-icon="mdi-content-copy"
              @click:append="copyTextToClipboard"
            ></v-text-field>
          </div>
        </v-card>
        <v-card class="elevation-6 pa-6 mt-6">
          <span class="title px-2">Google Chrome Extension</span>
          <div class="d-flex pt-6 px-2">
            <span>Use the {{ $variables.brand }} browser extension to quickly save web content to your knowledge base.</span>
          </div>
          <v-btn height="48" width="150" color="secondary" class="mt-6" @click="$utils.openInNewTab($variables.chromeExtensionUrl)">Install</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { Auth } from "aws-amplify";
import LoadingDialog from "../components/LoadingDialog";

export default {
  components: {
    LoadingDialog,
  },
  computed: {},
  data: () => ({
    apiToken: null,
    loading: true,
    generating: false,
  }),
  created() {
    var vm = this;
    Auth.currentAuthenticatedUser()
      .then((data) => {
        axios({
          method: vm.$variables.api.getApiToken.method,
          url: vm.$variables.api.getApiToken.url,
          headers: {
            Authorization: data.signInUserSession.idToken.jwtToken,
          },
        })
          .then(async function (response) {
            console.log(response);
            vm.apiToken = response.data.api_token;
            vm.loading = false;
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    regenerateApiToken: function () {
      var vm = this;
      vm.generating = true;
      Auth.currentAuthenticatedUser()
        .then((data) => {
          axios({
            method: vm.$variables.api.generateApiToken.method,
            url: vm.$variables.api.generateApiToken.url,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken,
            },
          })
            .then(async function (response) {
              console.log(response);
              vm.apiToken = response.data.api_token;
              vm.generating = false;
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fallbackCopyTextToClipboard: function () {
      var vm = this;
      var textArea = document.createElement("textarea");
      textArea.value = vm.apiToken;

      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand("copy");
        var msg = successful ? "successful" : "unsuccessful";
        console.log("Fallback: Copying text command was " + msg);
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }

      document.body.removeChild(textArea);
    },
    copyTextToClipboard: function () {
      console.log("fired");
      var vm = this;
      if (!navigator.clipboard) {
        vm.fallbackCopyTextToClipboard();
        return;
      }
      navigator.clipboard.writeText(vm.apiToken).then(
        function () {
          console.log("Async: Copying to clipboard was successful!");
        },
        function (err) {
          console.error("Async: Could not copy text: ", err);
        }
      );
    },
  },
};
</script>