<template>
  <!-- <v-container fluid class="fill-height"> -->
  <!-- <img src="../../public/homepage-top.svg" alt="triangle with all three sides equal" height="50%" width="100%" /> -->

  <!-- <v-carousel :value="mainCarousel" hide-delimiter-background show-arrows-on-hover height="100%">
    <v-carousel-item>
      
    </v-carousel-item>
    <v-carousel-item>
      <v-sheet :color="colors[0]" height="100%"></v-sheet>
    </v-carousel-item>
  </v-carousel>-->

  <v-row justify="center" align="center" class="fill-height">
    <v-col cols="12" xl="8">
      <div class="d-flex justify-center">
        <span>
          <div class="d-flex">
            <span id="brand" class="display-4">{{ $variables.brand }}</span>
            <v-img
              :src="getImgUrl('icon.png')"
              contain
              height="100"
              width="109"
            ></v-img>
          </div>

          <div class="mt-4">
            <span class="display-1">{{ $variables.tagLine }}</span>
          </div>
          <div class="mt-4">
            <v-btn outlined @click="mainCarousel = 1">Learn more</v-btn>
          </div>
        </span>
      </div>
    </v-col>
    <v-col cols="4">
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

  <!-- </v-container> -->
</template>

<script>
import { Auth } from "aws-amplify";

export default {
  data() {
    return {
      loading: false,
      mainCarousel: 0,
      colors: [
        "indigo",
        "warning",
        "pink darken-2",
        "red lighten-1",
        "deep-purple accent-4",
      ],
      slides: ["First", "Second", "Third", "Fourth", "Fifth"],
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
};
</script>

<style lang="scss">
#brand.display-4 {
  font-family: "Source Code Pro", monospace !important;
}
</style>