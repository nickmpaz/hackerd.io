<template>
  <div>
    <h1 class="source-code-pro mb-6">Integrations</h1>
    <v-card class="elevation-6 pa-6">
      <div>
        <span class="title px-2">API Token</span>
      </div>
      <hr class="mt-1">
      <div class="d-flex pt-6 px-2">
        <span>Use this token to connect {{ $variables.brand }} integrations to your account.</span>
      </div>
      <div class="d-flex pt-6">
        <v-text-field
          class="short-text-field"
          background-color="secondary"
          solo
          single-line
          readonly
          v-model="apiToken"
        >
          <template v-slot:prepend-inner>
            <v-progress-circular v-if="loading" size="24" indeterminate></v-progress-circular>
            <v-tooltip bottom v-else>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" class="mr-2" @click="regenerateApiToken">mdi-refresh</v-icon>
              </template>
              Refresh
            </v-tooltip>
          </template>
          <template v-slot:append>
            <v-tooltip bottom v-if="!loading">
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" class="ml-2" @click="$utils.copyTextToClipboard(apiToken)">mdi-content-copy</v-icon>
              </template>
              Copy
            </v-tooltip>
          </template>
        </v-text-field>
      </div>
    </v-card>
    <v-card class="elevation-6 pa-6 mt-6">
      <span class="title px-2">Google Chrome Extension</span>
      <hr class="mt-1">
      <div class="pt-6 px-2">
        <span>Bring {{ $variables.brand }} to your browser:</span>
        <ul>
          <li>See relevant resources when you use Google Search</li>
          <li>Quickly save new web content to your Stash</li>
        </ul>
      </div>
      <v-btn
        color="secondary"
        class="mt-6"
        @click="$utils.openInNewTab($variables.chromeExtensionUrl)"
      >Install</v-btn>
    </v-card>
    <v-card class="elevation-6 pa-6 mt-6">
      <span class="title px-2">Command Line Interface</span>
      <hr class="mt-1">
      <div class="pt-6 px-2">
      <span>Interact with your resources from the command line:</span>
        <ul>
          <li>Search for resources and copy them to your clipboard</li>
          <li>Create new resources with you text editor or IDE</li>
        </ul>
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
  </div>
</template>

<script>
import axios from "axios";
import { Auth } from "aws-amplify";

export default {
  components: {},
  computed: {},
  data() {
    // var vm = this
    var platforms = ["Linux", "MacOS"];
    return {
      apiToken: null,
      loading: true,
      platforms: platforms,
      selectedPlatform: platforms[0],
      linuxInstructions:
        "$ wget --no-check-certificate https://cli.stashable.io.s3.amazonaws.com/linux/stashable\n" +
        "$ sudo mv stashable /usr/local/bin/\n" +
        "$ sudo chmod +x /usr/local/bin/stashable\n" +
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
      vm.loading = true;
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