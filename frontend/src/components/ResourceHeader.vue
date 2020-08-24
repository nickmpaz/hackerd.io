<template>
  <div>
    <h1 class="title-case">{{ resource.title ? resource.title : "Untitled"}}</h1>
    <v-row dense class="mb-3 mt-1">
      <v-col cols="auto" v-if="resource.tags.length == 0">
        <v-card
          outlined
          class="px-1 py-1"
          dark
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
          dark
          :style="'border-color: ' + ($vuetify.theme.isDark ? $vuetify.theme.themes.dark.primary : $vuetify.theme.themes.light.primary)"
        >
          <v-icon small class="ml-1">mdi-tag</v-icon>
          <span class="px-1">{{ tag }}</span>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["resource"],
};
</script>