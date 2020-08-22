<template>
  <v-row justify="center" align="center" class="fill-height">
    <v-col cols="12" lg="8">
      <div class="d-flex justify-center">
        <span>
          <div class="d-flex">
            <span id="brand" :style="brandCss">{{ $variables.brand }}</span>
            <v-img :src="getImgUrl('icon.png')" contain :height="logoSize" :width="logoSize"></v-img>
          </div>

          <div v-if="$vuetify.breakpoint.smAndUp">
            <span class="display-1">{{ $variables.tagLine }}</span>
          </div>
          <div class="mt-6" v-if="$vuetify.breakpoint.smAndUp">
            <v-btn outlined @click="mainCarousel = 1">Learn more</v-btn>
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
          <v-img :src="getImgUrl('btn_google_light_normal_ios.svg')" contain height="60" width="60"></v-img>
          <span class="mr-6 ml-4">Sign in with Google</span>
        </v-btn>
      </div>
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
      console.log(this.$route);
      return images("./" + img);
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
#brand {
  font-family: "Source Code Pro", monospace !important;
}

#brand.xl {
  font-size: 5em;
}
</style>