<template>
  <div class="fill-height">
    <v-card class="px-4 py-1 fill-height">
      <v-card
        v-for="(resource, index) in searchResults"
        :key="index"
        class="px-4 pt-1 pb-2 my-3"
        @click="viewResource(resource)"
        :ripple="false"
        role="button"
        color="secondary"
      >
        <div class="d-flex flex-column">
          <div class="d-flex">
            <div class="d-flex no-wrap truncate-overflow flex-grow-1 align-center">
              <v-icon v-if="resource.type === 'note'" class="mr-2 pb-1">mdi-note-text</v-icon>
              <v-icon v-else-if="resource.type === 'link'" class="mr-2 pb-1">mdi-link-variant</v-icon>
              <v-icon v-else-if="resource.type === 'snippet'" class="mr-2 pb-1">mdi-code-braces</v-icon>
              <span class="title title-case">{{ resource.name ? resource.name : "Untitled"}}</span>
            </div>
            <v-menu bottom offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" class="ml-4">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item link @click="editResource(resource)">
                  <v-list-item-action>
                    <v-icon color="green">mdi-pencil</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="exportResource(resource)">
                  <v-list-item-action>
                    <v-icon color="blue">mdi-export</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>Export</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="moveResource(resource)">
                  <v-list-item-action>
                    <v-icon color="orange">mdi-folder-move</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>Move</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="deleteResource(resource)">
                  <v-list-item-action>
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <tag-list :tags="resource.tags" class="truncate-overflow py-1" />
        </div>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import TagList from "@/components/TagList";

export default {
  props: ["searchResults"],
  components: { TagList },
  methods: {
    viewResource: function(resource) {
      this.$emit('viewResource', resource)
    },
    deleteResource: function(resource) {
      this.$emit('deleteResource', resource)
    },
    editResource: function(resource) {
      this.$emit('editResource', resource)
    },
    exportResource: function (resource) {
      this.$utils.downloadObj(resource, resource.name);
    },
  },
};
</script>