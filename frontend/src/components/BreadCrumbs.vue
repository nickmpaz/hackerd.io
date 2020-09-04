<template>
  <div>
    <v-row no-gutters>
      <v-col v-for="(item, index) in items" :key="index" cols="auto">
        <v-icon>mdi-chevron-right</v-icon>
        <span class="primary--text px-1">{{ item.name }}</span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ["items"],
  methods: {},
};
</script>

<style>
</style>