<template>
  <div>
    <v-text-field
      v-model="resource.title"
      class="short-text-field"
      label="Title"
      single-line
      solo
      background-color="secondary"
    ></v-text-field>
    <v-text-field
      v-model="tagInput"
      @keydown.enter="addTag()"
      class="short-text-field"
      label="Add a tag (press Enter)"
      single-line
      solo
      background-color="secondary"
    ></v-text-field>
    <v-row dense class="my-1">
      <v-col cols="auto" v-if="resource.tags.length == 0">
        <v-card
          outlined
          class="px-1 py-1"
          :style="'border-color: ' + ($vuetify.theme.isDark ? $vuetify.theme.themes.dark.primary : $vuetify.theme.themes.light.primary)"
        >
          <v-icon small class="ml-1">mdi-tag</v-icon>
          <span class="px-1">no tags</span>
        </v-card>
      </v-col>
      <v-col cols="auto" v-for="(tag, index) in resource.tags" :key="index">
        <v-card
          outlined
          class="px-1 py-1"
          :style="'border-color: ' + ($vuetify.theme.isDark ? $vuetify.theme.themes.dark.primary : $vuetify.theme.themes.light.primary)"
        >
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
</style>