<template>
  <v-container fluid>
    <loading-dialog :active="loading" message="Loading" />
    <loading-dialog :active="creating" message="Creating" />
    <loading-dialog :active="deleting" message="Deleting" />
    <loading-dialog :active="moving" message="Moving" />
    <namespace-selector-dialog
      :active="selecting"
      confirmMessage="Move"
      declineMessage="Cancel"
      @confirm="moveResource"
      @decline="selecting = false"
    />
    <confirm-dialog
      :active="confirmDeleteDialog"
      prompt="Delete Resource?"
      confirmMessage="delete"
      declineMessage="cancel"
      @confirm="deleteResource"
      @decline="confirmDeleteDialog = false"
    />
    <create-resource-prompt-dialog
      :active="createResourcePromptDialog"
      confirmMessage="Create"
      declineMessage="cancel"
      @confirm="createResource"
      @decline="createResourcePromptDialog = false"
    />
    <div v-if="!loading">
      <v-row justify="center">
        <v-col cols="12" md="10" xl="8">
          <h1 class="source-code-pro">Resources</h1>
          <div class="d-flex my-6 align-center">
            <v-row class="flex-grow-1" no-gutters>
              <v-col cols="auto">
                <v-icon class="pr-1">mdi-chevron-right</v-icon>
              </v-col>
              <v-col
                v-for="(namespace, index) in namespaceBreadcrumbsList"
                :key="index"
                cols="auto"
              >
                <span class="primary--text">{{ namespace.name }}</span>
                <v-icon
                  class="px-1"
                  v-if="index != namespaceBreadcrumbsList.length - 1"
                >mdi-chevron-right</v-icon>
              </v-col>
            </v-row>
            <responsive-button-group
              :items="actionItems"
              :collapse="$vuetify.breakpoint.mdAndDown"
              menuText="Actions"
              menuIcon="mdi-chevron-down"
              menuWidth="150"
            />
          </div>
          <v-text-field
            :label="'Search ' + activeNamespace.name"
            solo
            autofocus
            single-line
            v-model="query"
            class="short-text-field mb-4"
          ></v-text-field>
          <no-content
            v-if="searchResults.length == 0"
            callToAction="Click here to create a resource."
            @engage="createResourcePromptDialog = true"
          />
          <v-card v-else class="px-4 pt-4 pb-1">
            <v-card
              v-for="(resource, index) in searchResults"
              :key="index"
              :id="index == focusIndex ? 'focused-resource' : ''"
              :class="'px-4 py-1 mb-4 ' + (index == focusIndex ? ('focused-resource-' + ($vuetify.theme.dark ? 'dark' : 'light')) : '')"
              @click="viewResource(resource)"
              :ripple="false"
              role="button"
              color="secondary"
            >
              <div class="d-flex align-center">
                <div class="d-flex align-center no-wrap truncate-overflow flex-grow-1">
                  <span class="title title-case">
                    <v-icon v-if="resource.type === 'note'" class="mr-2 pb-1">mdi-note-text</v-icon>
                    <v-icon v-if="resource.type === 'link'" class="mr-2 pb-1">mdi-link-variant</v-icon>
                    <v-icon v-if="resource.type === 'snippet'" class="mr-2 pb-1">mdi-code-braces</v-icon>
                    {{ resource.title ? resource.title : "Untitled"}}
                  </span>
                  <v-icon class="ml-3 mr-1">mdi-minus</v-icon>

                  <v-card
                    class="px-1 py-1 ml-2"
                    outlined
                    dark
                    v-if="resource.tags.length == 0"
                    :style="'border-color: ' + ($vuetify.theme.isDark ? $vuetify.theme.themes.dark.primary : $vuetify.theme.themes.light.primary)"
                  >
                    <div class="d-flex flex-nowrap">
                      <v-icon small class="ml-1">mdi-tag</v-icon>
                      <span class="px-1">No tags</span>
                    </div>
                  </v-card>

                  <v-card
                    class="px-1 py-1 ml-2"
                    dark
                    outlined
                    v-for="(tag, index) in resource.tags"
                    :key="index"
                    :style="'border-color: ' + ($vuetify.theme.isDark ? $vuetify.theme.themes.dark.primary : $vuetify.theme.themes.light.primary)"
                  >
                    <div class="d-flex flex-nowrap">
                      <v-icon small class="ml-1">mdi-tag</v-icon>
                      <span class="px-1 no-wrap">{{ tag }}</span>
                    </div>
                  </v-card>
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
                    <v-list-item link @click="selecting = true; resourceToMove = resource">
                      <v-list-item-action>
                        <v-icon color="orange">mdi-folder-move</v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>Move</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      link
                      @click="confirmDeleteDialog = true; resourceToDelete = resource"
                    >
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
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import LoadingDialog from "../components/LoadingDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import NamespaceSelectorDialog from "../components/NamespaceSelectorDialog";
import CreateResourcePromptDialog from "../components/CreateResourcePromptDialog";
import NoContent from "@/components/NoContent";
import ResponsiveButtonGroup from "@/components/ResponsiveButtonGroup";

import axios from "axios";
import { Auth } from "aws-amplify";
import Fuse from "fuse.js";

export default {
  components: {
    LoadingDialog,
    ConfirmDialog,
    NamespaceSelectorDialog,
    CreateResourcePromptDialog,
    NoContent,
    ResponsiveButtonGroup,
  },
  props: ["drawer"],
  computed: {
    searchResults: function() {
      var vm = this;
      var filteredResources = vm.resources.filter(e =>
        vm.activeNamespace.resourceFilter(e)
      );
      if (vm.query == "") {
        vm.searchResultsLength = filteredResources.length;
        if (vm.focusIndex > vm.searchResultsLength - 1) {
          vm.focusIndex = vm.searchResultsLength - 1;
        }
        return filteredResources;
      }
      const options = {
        threshold: 0.25,
        keys: ["title", "tags"]
      };

      const fuse = new Fuse(filteredResources, options);

      var query = vm.query;
      var tagsToSearch = [];
      var uniqueTags = [];
      var tag;

      if (query.includes(" ")) {
        query.split(" ");
        query.forEach(element => uniqueTags.push({ element }));

        for (var i = 0; i < uniqueTags.length; i++) {
          tag = { tags: uniqueTags[i] };
          tagsToSearch.push(tag);
        }
      } else {
        tag = { tags: query };
        tagsToSearch.push(tag);
      }

      const result = fuse.search({
        $and: tagsToSearch
      });

      const finalResult = result.map(a => a.item);
      vm.searchResultsLength = finalResult.length;
      if (vm.focusIndex > vm.searchResultsLength - 1) {
        vm.focusIndex = vm.searchResultsLength - 1;
      }
      return finalResult;
    },
    activeNamespace: function() {
      return this.$store.getters.activeNamespace;
    },
    namespaceBreadcrumbsList: function() {
      return this.$store.getters.namespaceBreadcrumbsList;
    }
  },
  data() {
    var vm = this;
    return {
      query: "",
      fab: false,
      creating: false,
      deleting: false,
      selecting: false,
      moving: false,
      createResourcePromptDialog: false,
      confirmDeleteDialog: false,
      resourceToDelete: null,
      resourceToMove: null,
      loading: true,
      resources: [],
      focusIndex: -1,
      searchResultsLength: 0,
      hotkeysActive: true,
      actionItems: [
        {
          text: "Create",
          icon: "mdi-plus",
          buttonColor: "none",
          buttonWidth: "150",
          iconColor: "green",
          function: function () {
            vm.createResourcePromptDialog = true;
          },
        },
        {
          text: "Import",
          icon: "mdi-import",
          buttonColor: "none",
          buttonWidth: "150",
          iconColor: "blue",
          function: function () {
            vm.importResource();
          },
        },
      ],
    };
  },
  mounted() {
    var vm = this;
    vm._keyListener = function(e) {
      if (!vm.$store.getters.hotkeysActive) return;
      console.log(e);
      if (
        e.key === "ArrowDown" ||
        (e.key === "j" && (e.ctrlKey || e.metaKey))
      ) {
        e.preventDefault();
        vm.incrementFocus();
      } else if (
        e.key === "ArrowUp" ||
        (e.key === "k" && (e.ctrlKey || e.metaKey))
      ) {
        e.preventDefault();
        vm.decrementFocus();
      } else if (e.key === "Enter") {
        console.log("yuh");
        e.preventDefault();
        vm.viewResource(vm.searchResults[vm.focusIndex]);
      }
    };
    document.addEventListener("keydown", vm._keyListener);
  },
  beforeDestroy() {
    var vm = this;
    document.removeEventListener("keydown", vm._keyListener);
  },
  created() {
    var vm = this;
    // check for page content in session storage
    if (sessionStorage.getItem(vm.$route.fullPath + ".resources")) {
      vm.resources = JSON.parse(
        sessionStorage.getItem(vm.$route.fullPath + ".resources")
      );
      vm.loading = false;
    }
    vm.getResources();
    console.log(vm.$vuetify);
  },
  methods: {
    exportResource: function(resource) {
      console.log(resource);
      var vm = this;
      vm.$utils.downloadObj(resource, resource.title);
    },
    ctrlJ: function(event) {
      event.preventDefault();
      console.log("ctrl j");
    },
    ctrlK: function(event) {
      event.preventDefault();
      console.log("ctrl k");
    },
    getResources: function() {
      var vm = this;
      Auth.currentAuthenticatedUser()
        .then(data => {
          axios({
            method: vm.$variables.api.getResources.method,
            url: vm.$variables.api.getResources.url,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken
            }
          })
            .then(response => {
              vm.resources = response.data.resources;
              vm.loading = false;
              sessionStorage.setItem(
                vm.$route.fullPath + ".resources",
                JSON.stringify(response.data.resources)
              );
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },

    scrollFocusToCenter: function() {
      const focused = document.getElementById("focused-resource");
      focused.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center"
      });
    },
    incrementFocus: function() {
      var vm = this;
      if (vm.focusIndex < vm.searchResultsLength - 1) {
        vm.focusIndex++;
      }
      vm.scrollFocusToCenter();
    },
    decrementFocus: function() {
      var vm = this;
      if (vm.focusIndex > -1) {
        vm.focusIndex--;
      }
      vm.scrollFocusToCenter();
    },
    openInNewTab: function(url) {
      var win = window.open(url, "_blank");
      win.focus();
    },
    viewResource: function(resource) {
      var vm = this;
      if (resource.type === "link") {
        vm.openInNewTab(resource.content);
      } else {
        vm.$router.push({
          name: "Resource",
          params: { resource: resource, resource_id: resource.resource_id }
        });
      }
    },
    editResource: function(resource) {
      var vm = this;
      vm.$router.push({
        name: "Resource",
        params: {
          resource: resource,
          resource_id: resource.resource_id,
          edit: true
        }
      });
    },
    createResource: async function(type) {
      var vm = this;
      vm.createResourcePromptDialog = false;
      vm.creating = true;
      var payload = {
        type: type,
        namespace: vm.activeNamespace.namespace_id
      };
      var resource = await vm.$api.createResource(payload);
      vm.creating = false;
      vm.$router.push({
        name: "Resource",
        params: {
          resource: resource,
          resource_id: resource.resource_id,
          edit: true
        }
      });
    },
    importResource: async function() {
      var vm = this;
      var payload = {
        resource: await vm.$utils.getLocalFileContents()
      };
      vm.creating = true;
      var resource = await vm.$api.createResource(payload);
      vm.creating = false;
      vm.$router.push({
        name: "Resource",
        params: {
          resource: resource,
          resource_id: resource.resource_id,
          edit: true
        }
      });
    },
    deleteResource: function() {
      var vm = this;
      vm.confirmDeleteDialog = false;
      vm.deleting = true;
      Auth.currentAuthenticatedUser()
        .then(data => {
          axios({
            method: vm.$variables.api.deleteResource.method,
            url:
              vm.$variables.api.deleteResource.url +
              vm.resourceToDelete.resource_id,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken
            }
          })
            .then(response => {
              console.log(response);
              vm.deleting = false;
              vm.resources = vm.resources.filter(
                e => e !== vm.resourceToDelete
              );
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    moveResource: function(namespace_id) {
      var vm = this;
      vm.selecting = false;
      vm.moving = true;
      vm.resourceToMove.namespace = namespace_id;
      Auth.currentAuthenticatedUser()
        .then(data => {
          axios({
            method: vm.$variables.api.updateResource.method,
            url:
              vm.$variables.api.updateResource.url +
              vm.resourceToMove.resource_id,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken
            },
            data: {
              resource: vm.resourceToMove
            }
          })
            .then(response => {
              console.log(response);
              vm.moving = false;
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss">
.focused-resource-dark {
  outline-style: solid;
  outline-color: white;
}

.focused-resource-light {
  outline-style: solid;
  outline-color: #212121;
}
</style>
