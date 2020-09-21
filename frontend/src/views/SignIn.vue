<template>
  <v-container>
    <div class="d-flex align-center" style="min-height: 100vh;">
      <v-row justify="center" align="center">
        <v-col cols="12" lg="8">
          <div class="d-flex justify-center">
            <span>
              <div class="d-flex">
                <span class="source-code-pro" :style="brandCss">{{ $variables.brand }}</span>
                <v-img :src="getImgUrl('icon.png')" contain :height="logoSize" :width="logoSize"></v-img>
              </div>

              <div v-if="$vuetify.breakpoint.smAndUp">
                <span class="display-1">{{ $variables.tagLine }}</span>
              </div>
              <div class="mt-6" v-if="$vuetify.breakpoint.smAndUp">
                <v-btn outlined @click="scrollToAbout">Learn more</v-btn>
              </div>
            </span>
          </div>
        </v-col>
        <v-col cols="12" lg="4">
          <div class="d-flex justify-center">
            <v-btn
              @click="federatedSignIn"
              :loading="loading"
              height="75"
              width="300"
              color="white"
              light
            >
              <v-img
                :src="getImgUrl('btn_google_light_normal_ios.svg')"
                contain
                height="60"
                width="60"
                flat
              ></v-img>
              <span class="mr-6 ml-4">Sign in with Google</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="pa-6" id="about">
      <v-row align="center" justify="center">
        <v-col cols="12" md="10" xl="10">
          <v-row class="my-6">
            <v-col cols="12" lg="6">
              <v-card class="pa-6 fill-height">
                <h1>Store your entire knowledge base in one place.</h1>
                <hr class="my-6" />
                <span class="title">
                  Unify your bookmarks, notes, and code snippets.
                  Use {{ $variables.brand }} to consolidate the knowledge base resources you use in your development workflow.
                </span>
              </v-card>
            </v-col>
            <v-col cols="12" lg="6">
              <v-img :src="getImgUrl('index-page.png')" flat contain class="fill-height"></v-img>
            </v-col>
          </v-row>
          <v-row class="my-6">
            <v-col cols="12" lg="6">
              <v-img :src="getImgUrl('notes-page.png')" flat contain class="fill-height"></v-img>
            </v-col>
            <v-col cols="12" lg="6">
              <v-card class="pa-6 fill-height">
                <h1>Add to your knowledge base quickly and easily.</h1>
                <hr class="my-6" />
                <span class="title">
                  {{ $variables.brand }}'s data model makes it easy to add to your knowledge base.
                  Don't worry about hierarchy or structure -
                  just create resources and use {{ $variables.brand }}'s powerful search features to find them when you need to.
                </span>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="my-6">
            <v-col cols="12" lg="6">
              <v-card class="pa-6 fill-height">
                <h1>Integrate your knowledge base with the tools you use every day.</h1>
                <hr class="my-6" />
                <span
                  class="title"
                >Get the most out of your knowledge base by connecting it to tools like your web browser and IDE.</span>
              </v-card>
            </v-col>
            <v-col cols="12" lg="6">
              <v-img :src="getImgUrl('chrome-logo.jpg')" height="175" flat class="mb-6"></v-img>
              <v-img :src="getImgUrl('vscode-logo.png')" height="175" flat></v-img>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { Auth } from "aws-amplify";

export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    federatedSignIn: function () {
      this.loading = true;
      Auth.federatedSignIn({
        provider: "Google",
      });
    },
    getImgUrl: function (img) {
      var images = require.context("../assets/");
      return images("./" + img);
    },
    scrollToAbout: function () {
      const elem = document.getElementById("about");
      elem.scrollIntoView({behavior: 'smooth'});
    },
  },
  computed: {
    brandCss: function () {
      var vm = this;
      var brandCss = "font-size: 2em;";
      if (vm.$vuetify.breakpoint.lgAndUp) {
        brandCss = "font-size: 5em;";
      } else if (vm.$vuetify.breakpoint.smAndUp) {
        brandCss = "font-size: 4em;";
      }
      return brandCss;
    },
    logoSize: function () {
      var vm = this;
      var logoSize = 50;
      if (vm.$vuetify.breakpoint.lgAndUp) {
        logoSize = 100;
      } else if (vm.$vuetify.breakpoint.smAndUp) {
        logoSize = 75;
      }
      console.log(logoSize);
      return logoSize;
    },
  },

  // created() {
  //   console.log(this.)
  // }
};
</script>

<style lang="scss">

</style>