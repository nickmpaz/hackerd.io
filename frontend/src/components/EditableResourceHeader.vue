<template>
  <div>
    <v-text-field v-model="resource.title" class="tag-input" label="Title" single-line solo></v-text-field>
    <v-text-field
      v-model="tagInput"
      @keydown.enter="addTag()"
      class="tag-input"
      label="Add a tag"
      single-line
      solo
    ></v-text-field>
    <v-row dense class="mb-3 mt-1">
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
</template>

<script>
export default {
  props: ["resource"],
  data: () => ({
    tagInput: "",
  }),
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
  },
};
</script>

<style lang="scss">
.tag-input {
  height: 55px;
}
</style>