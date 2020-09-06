<template>
  <v-container fluid>
    <loading-dialog :active="generating" message="Generating API Token" />
    <h1 class="source-code-pro mb-6">Integrations</h1>
    <v-card class="elevation-6 pa-6">
      <div>
        <span class="title px-2">API Token</span>
      </div>
      <div class="d-flex pt-6 px-2">
        <span>Use this token to connect {{ $variables.brand }} integrations to your account.</span>
      </div>
      <div class="d-flex pt-6">
        <v-btn
          height="48"
          width="150"
          color="secondary"
          class="mr-2"
          @click="regenerateApiToken"
          :loading="loading"
        >regenerate</v-btn>
        <v-text-field
          class="short-text-field"
          background-color="secondary"
          solo
          single-line
          readonly
          v-model="apiToken"
          append-icon="mdi-content-copy"
          @click:append="$utils.copyTextToClipboard(apiToken)"
        ></v-text-field>
      </div>
    </v-card>
    <v-card class="elevation-6 pa-6 mt-6">
      <span class="title px-2">Google Chrome Extension</span>
      <div class="d-flex pt-6 px-2">
        <span>Use the {{ $variables.brand }} browser extension to quickly save web content to your knowledge base.</span>
      </div>
      <v-btn
        height="48"
        width="150"
        color="secondary"
        class="mt-6"
        @click="$utils.openInNewTab($variables.chromeExtensionUrl)"
      >Install</v-btn>
    </v-card>
    <v-card class="elevation-6 pa-6 mt-6">
      <span class="title px-2">Command Line Interface</span>
      <div class="d-flex pt-6 px-2">
        <span>Use the {{ $variables.brand }} command line interface to create new resources using your IDE.</span>
      </div>

      <v-select
        :items="platforms"
        :value="selectedPlatform"
        label="Platform"
        class="px-2 py-6"
        single-line
      ></v-select>
      <div
        :class="'px-2 ' + (this.$vuetify.theme.dark ? 'markdown-body-dark' : 'markdown-body-light')"
      >
        <pre><code>{{ linuxInstructions }}</code></pre>
      </div>
    </v-card>
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
  data() {
    // var vm = this
    var platforms = ["Linux", "MacOS"];
    return {
      apiToken: null,
      loading: true,
      generating: false,
      platforms: platforms,
      selectedPlatform: platforms[0],
      linuxInstructions:
        "$ wget --no-check-certificate https://cli.stashable.io.s3.amazonaws.com/linux/stashable\n" +
        "$ mv stashable /usr/local/bin/\n" +
        "$ chmod +x /usr/local/bin/stashable\n" +
        "$ stashable --help",
    };
  },
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
  },
};
</script>

<style lang="scss">
@import "../styles/markdown-light.scss";
@import "../styles/markdown-dark.scss";

.markdown-body-dark {
  pre {
    &::before {
      content: attr(data-language);
      text-transform: uppercase;
      display: block;
      text-align: right;
      font-weight: bold;
      font-size: 0.6rem;
    }
    code {
      color: white !important;
      @import "highlight.js/scss/atom-one-dark.scss";
    }
  }
}

.markdown-body-light {
  pre {
    &::before {
      content: attr(data-language);
      text-transform: uppercase;
      display: block;
      text-align: right;
      font-weight: bold;
      font-size: 0.6rem;
    }
    code {
      color: black !important;
      @import "highlight.js/scss/atom-one-light.scss";
    }
  }
}
</style>