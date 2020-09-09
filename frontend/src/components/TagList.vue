<template>
  <div>
    <v-row v-if="grid" dense  class="mb-3 mt-1">
      <v-col cols="auto" v-if="tags.length == 0">
        <v-card
          outlined
          class="px-1"
          :style="'border-color: ' + ($vuetify.theme.isDark ? $vuetify.theme.themes.dark.primary : $vuetify.theme.themes.light.primary)"
        >
          <v-icon small class="ml-1">mdi-tag</v-icon>
          <span class="px-1">no tags</span>
        </v-card>
      </v-col>
      <v-col cols="auto" v-for="(tag, index) in tags" :key="index">
        <v-card
          outlined
          class="px-1 "
          :style="'border-color: ' + ($vuetify.theme.isDark ? $vuetify.theme.themes.dark.primary : $vuetify.theme.themes.light.primary)"
        >
          <v-icon small class="ml-1">mdi-tag</v-icon>
          <span class="px-1">{{ tag }}</span>
        </v-card>
      </v-col>
    </v-row>
    <div v-else class="d-flex">
      <v-card
        class="px-1"
        outlined
        v-if="tags.length == 0"
        :style="'border-color: ' + ($vuetify.theme.isDark ? $vuetify.theme.themes.dark.primary : $vuetify.theme.themes.light.primary)"
      >
        <div class="d-flex flex-nowrap">
          <v-icon small class="ml-1">mdi-tag</v-icon>
          <span class="px-1 no-wrap">No tags</span>
        </div>
      </v-card>
      <v-card
        :class="'px-1 ' + (index == 0 || 'ml-2')"
        outlined
        v-for="(tag, index) in tags"
        :key="index"
        :style="'border-color: ' + ($vuetify.theme.isDark ? $vuetify.theme.themes.dark.primary : $vuetify.theme.themes.light.primary)"
      >
        <div class="d-flex flex-nowrap">
          <v-icon small class="ml-1">mdi-tag</v-icon>
          <span class="px-1 no-wrap">{{ tag }}</span>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  props: ["tags", "grid"],
  methods: {},
};
</script>

<style>
</style>