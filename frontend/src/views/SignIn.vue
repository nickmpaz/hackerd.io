<template>
  <v-container fluid class="fill-height">
    <!-- <img src="../../public/homepage-top.svg" alt="triangle with all three sides equal" height="50%" width="100%" /> -->
    <v-row justify="center" align="center">
      <v-col cols="8">
        <div class="d-flex justify-center">
          <span>
            <div>
              <span class="display-4">{{ $variables.brand }}</span>
            </div>

            <div class="mt-4">
              <span class="display-1">Build a beautiful, integrated knowledge base for programming</span>
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
            <v-img
              :src="getImgUrl('btn_google_light_normal_ios.svg')"
              contain
              height="60"
              width="60"
            ></v-img>
            <span class="mr-6 ml-4">Sign in with Google</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Auth } from "aws-amplify";

export default {
  data() {
    return {
      loading: false
    };
  },
  methods: {
    federatedSignIn: function() {
      this.loading = true;
      Auth.federatedSignIn({
        provider: "Google"
      });
    },
    getImgUrl: function(img) {
      var images = require.context("../assets/");
      return images("./" + img);
    }
  }
};
</script>

<style lang="scss">
#jumbotron {
  // background: url("../../public/Large-Triangles-dark.svg");

  padding: 0;
  background-repeat: no-repeat;
}
</style>