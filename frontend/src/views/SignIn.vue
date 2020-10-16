<template>
  <v-row
    class="fill-height"
    :justify="$vuetify.breakpoint.xl ? 'end' : 'center'"
  >
    <v-col
      cols="12"
      md="8"
      lg="5"
      class="fill-height d-flex flex-column justify-center"
    >
      <h1 class="main-text mb-6">
        Super charge your knowledge-based workflows.
      </h1>
      <p class="sub-text mb-12">
        Take your productivity to the next level with Stashable.io. Consolidate
        your knowledge base and integrate it into the tools you use every day.
      </p>
      <v-container fluid>
        <v-row>
          <v-col
            cols="12"
            xl="6"
            :class="
              $vuetify.breakpoint.lgAndDown ? 'd-flex justify-center' : ''
            "
          >
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
          </v-col>
          <v-col
            cols="12"
            xl="6"
            :class="
              $vuetify.breakpoint.lgAndDown ? 'd-flex justify-center' : ''
            "
          >
            <v-btn color="primary" width="300" height="75">Learn More</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-col>
    <v-col v-if="$vuetify.breakpoint.lgAndUp" cols="6">
      <v-row class="fill-height" no-gutters>
        <v-col cols="4" class="d-flex flex-column justify-center">
          <img
            :src="$utils.assets('./phone1.png')"
            alt=""
            class="visual"
            style="height: 65%"
          />
        </v-col>
        <v-col cols="8" class="d-flex flex-column justify-center">
          <img
            :src="$utils.assets('./carbon.svg')"
            alt=""
            class="visual"
            style="height: 25%"
          />
          <img
            :src="$utils.assets('./editor.png')"
            alt=""
            class="visual"
            style="height: 40%"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
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
      elem.scrollIntoView({ behavior: "smooth" });
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
};
</script>

<style lang="scss">
.main-text {
  font-size: 60px;
}

.sub-text {
  font-size: 25px;
}

.placeholder {
  background-color: grey;
  padding: 10px;
  border-radius: 8px;
}

.visual {
  width: 100%;
  padding: 15px;
  border-radius: 12px;
}
</style>