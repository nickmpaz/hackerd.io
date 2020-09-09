<template>
  <div class="d-flex flex-column fill-height">
    <div class="flex-grow-1">
      <v-text-field
        v-model="resource.title"
        class="short-text-field"
        label="Title"
        single-line
        solo
      ></v-text-field>
      <v-text-field
        v-model="tagInput"
        @keydown.enter="addTag()"
        class="short-text-field"
        label="Add a tag"
        single-line
        solo
      ></v-text-field>
      <v-row dense class="mb-3 mt-1" id="tags">
        <v-col cols="auto" v-if="resource.tags.length == 0">
          <v-card color="primary" class="px-1 py-1" dark>
            <v-icon small class="ml-1">mdi-tag</v-icon>
            <span class="px-1">No tags</span>
          </v-card>
        </v-col>
        <v-col cols="auto" v-for="(tag, index) in resource.tags" :key="index">
          <v-card color="primary" class="px-1 py-1" dark>
            <v-icon @click="removeTag(tag)">mdi-close</v-icon>
            <span class="px-1">{{ tag }}</span>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div class="d-flex">
      <v-spacer></v-spacer>
      <v-btn color="success" @click="createLinkResource" :loading="loading">Create</v-btn>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["apiToken", "content"],
  data: () => ({
    tagInput: "",
    resource: {
      title: "",
      tags: [],
      content: "",
    },
    loading: false,
  }),
  created() {
    var vm = this;
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      vm.resource.content = tabs[0].url;
      vm.resource.title = tabs[0].title;
    });
  },
  methods: {
    addTag: function () {
      var vm = this;
      if (!vm.resource.tags.includes(vm.tagInput)) {
        vm.resource.tags.push(vm.tagInput.toLowerCase().trim());
        vm.resource.tags.sort();
      }
      vm.tagInput = "";
    },
    removeTag: function (tag) {
      var vm = this;
      vm.resource.tags = vm.resource.tags.filter((e) => e !== tag);
      document.activeElement.blur(); // stop next tag from getting button focus after you remove a tag
    },
    createLinkResource: function () {
      var vm = this;
      vm.loading = true
      axios({
        method: "post",
        url: `${vm.$variables.api}external/create_resource`,
        data: {
          apiToken: vm.apiToken,
          type: "link",
          title: vm.resource.title,
          tags: vm.resource.tags,
          content: vm.resource.content,
        },
      })
        .then((response) => {
          console.log(response);
          vm.loading = false
          window.close()
        })
        .catch((err) => {
          vm.loading = false
          console.error(err);
        });
    },
  },
};
</script>

<style lang="scss">
#tags {
  min-height: 125px;
}
</style>