<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="8" class="pane-holder">
        <div class="d-flex justify-center pane-holder">
          <v-card
            class="pane-1 markdown-body-dark line-numbers px-4 pb-2"
            :style="panePositions[pos1]"
          >
            <div v-html="html1"></div>
          </v-card>
          <v-card
            class="pane-2 markdown-body-dark line-numbers px-4 pb-2"
            :style="panePositions[pos2]"
          >
            <div v-html="html2"></div>
          </v-card>
          <v-card
            class="pane-3 markdown-body-dark line-numbers px-4 pb-2"
            :style="panePositions[pos3]"
          >
            <div v-html="html3"></div>
          </v-card>
          <v-card
            class="pane-4 markdown-body-dark line-numbers px-4 pb-2"
            :style="panePositions[pos4]"
          >
            <div v-html="html4"></div>
          </v-card>
        </div>
      </v-col>
      <v-col cols="4">
        <v-btn @click="federatedSignIn" :loading="loading">Sign in with Google</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Auth } from "aws-amplify";
// import prism from "prismjs";

export default {
  data: () => ({
    md1:
      '\n## Generate a Beautiful Knowledge Base\n```python\nhiei_power = {"Hiei": "Jagan Eye"}\nyusuke_power = {"Yusuke Urameshi": "Spirit Gun"}\npowers = dict()\n\n# Brute force\nfor dictionary in (yusuke_power, hiei_power):\n    for key, value in dictionary.items():\n        powers[key] = value\n\n# Dictionary unpacking (Python 3.5+)\npowers = {**yusuke_power, **hiei_power}\n\n# Backwards compatible function\ndef merge_dicts(*dicts: dict):\n    merged_dict = dict()\n    for dictionary in dicts:\n        merge_dict.update(dictionary)\n    return merged_dict\n```\n',
    html1: "",
    pos1: 0,
    md2:
      '\n## Quickly Find the Information You Need\n```python\nhiei_power = {"Hiei": "Jagan Eye"}\nyusuke_power = {"Yusuke Urameshi": "Spirit Gun"}\npowers = dict()\n\n# Brute force\nfor dictionary in (yusuke_power, hiei_power):\n    for key, value in dictionary.items():\n        powers[key] = value\n\n# Dictionary unpacking (Python 3.5+)\npowers = {**yusuke_power, **hiei_power}\n\n# Backwards compatible function\ndef merge_dicts(*dicts: dict):\n    merged_dict = dict()\n    for dictionary in dicts:\n        merge_dict.update(dictionary)\n    return merged_dict\n```\n',
    html2: "",
    pos2: 1,
    md3:
      '\n## Export Your Notes to Any Format\n```python\nhiei_power = {"Hiei": "Jagan Eye"}\nyusuke_power = {"Yusuke Urameshi": "Spirit Gun"}\npowers = dict()\n\n# Brute force\nfor dictionary in (yusuke_power, hiei_power):\n    for key, value in dictionary.items():\n        powers[key] = value\n\n# Dictionary unpacking (Python 3.5+)\npowers = {**yusuke_power, **hiei_power}\n\n# Backwards compatible function\ndef merge_dicts(*dicts: dict):\n    merged_dict = dict()\n    for dictionary in dicts:\n        merge_dict.update(dictionary)\n    return merged_dict\n```\n',
    html3: "",
    pos3: 2,
    md4:
      '\n## Integrate With Your Favorite Tools\n```python\nhiei_power = {"Hiei": "Jagan Eye"}\nyusuke_power = {"Yusuke Urameshi": "Spirit Gun"}\npowers = dict()\n\n# Brute force\nfor dictionary in (yusuke_power, hiei_power):\n    for key, value in dictionary.items():\n        powers[key] = value\n\n# Dictionary unpacking (Python 3.5+)\npowers = {**yusuke_power, **hiei_power}\n\n# Backwards compatible function\ndef merge_dicts(*dicts: dict):\n    merged_dict = dict()\n    for dictionary in dicts:\n        merge_dict.update(dictionary)\n    return merged_dict\n```\n',
    html4: "",
    pos4: 3,
    panePositions: [
      "margin-top: -40vh; margin-left: 0vh; z-index: 1;",
      "margin-top: -30vh; margin-left: -30vh; z-index: 2;",
      "margin-top: -20vh; margin-left: 0vh; z-index: 4;",
      "margin-top: -30vh; margin-left: 30vh; z-index: 3;"
    ]
  }),
  async created() {
    var vm = this;
    vm.html1 = vm.$md.render(vm.md1);
    vm.html2 = vm.$md.render(vm.md2);
    vm.html3 = vm.$md.render(vm.md3);
    vm.html4 = vm.$md.render(vm.md4);
    setInterval(function() {
      vm.moveCarousel()
    }, 5000);
  },
  methods: {
    federatedSignIn: function() {
      this.loading = true;
      Auth.federatedSignIn({
        provider: "Google"
      });
    },
    moveCarousel: function() {
      var vm = this;
      vm.pos1 = (vm.pos1 + 1) % 4;
      vm.pos2 = (vm.pos2 + 1) % 4;
      vm.pos3 = (vm.pos3 + 1) % 4;
      vm.pos4 = (vm.pos4 + 1) % 4;
    }
  }
};
</script>

<style lang="scss">
@import "../styles/markdown-light.scss";
@import "../styles/markdown-dark.scss";
@import "prismjs/plugins/line-numbers/prism-line-numbers";

.markdown-body-light {
  @import "../styles/prism-themes/prism-material-light";
  @import "../styles/prism-toolbar-light.scss";
}

.markdown-body-dark {
  @import "../styles/prism-themes/prism-material-dark";
  @import "../styles/prism-toolbar-dark.scss";
}

.pane-holder {
  position: relative;
}

.pane-1 {
  position: absolute;
  // margin-top: -40vh;
  // margin-left: 0vh;
  transition: margin-top 1s, margin-left 1s;
}

.pane-2 {
  position: absolute;
  // margin-top: -30vh;
  // margin-left: -30vh;
  transition: margin-top 1s, margin-left 1s;
}
.pane-3 {
  position: absolute;
  // margin-top: -30vh;
  // margin-left: 30vh;
  transition: margin-top 1s, margin-left 1s;
}
.pane-4 {
  position: absolute;
  // margin-top: -20vh;
  // margin-left: 0vh;
  transition: margin-top 1s, margin-left 1s;
}
</style>