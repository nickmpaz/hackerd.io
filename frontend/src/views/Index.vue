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
    <div v-if="!loading">
      <v-speed-dial
        v-model="fab"
        fixed
        bottom
        right
        direction="top"
        transition="slide-y-reverse-transition"
        class="ma-6"
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="primary" dark fab :large="$vuetify.breakpoint.lgAndUp">
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-btn
          fab
          dark
          :large="$vuetify.breakpoint.lgAndUp"
          color="success"
          @click="createResource('note')"
        >
          <v-icon>mdi-note-text</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          :large="$vuetify.breakpoint.lgAndUp"
          color="success"
          @click="createResource('link')"
        >
          <v-icon>mdi-link-variant</v-icon>
        </v-btn>
      </v-speed-dial>

      <v-row justify="center" class="my-12">
        <v-col cols="12" md="10" xl="8">
          <v-text-field
            :label="'Search ' + activeNamespace.name"
            solo
            autofocus
            single-line
            v-model="query"
            class="mb-6"
          ></v-text-field>
          <v-card
            v-for="(resource, index) in searchResults"
            :key="index"
            :id="index == focusIndex ? 'focused-resource' : ''"
            :class="'px-4 pt-1 pb-2 mb-4 ' + (index == focusIndex ? ('focused-resource-' + ($vuetify.theme.dark ? 'dark' : 'light')) : '')"
            @click="viewResource(resource)"
            :ripple="false"
            role="button"
          >
            <div class="d-flex">
              <h1 class="flex-grow-1 truncate title-case">
                <v-icon v-if="resource.type === 'note'" class="mr-2">mdi-note-text</v-icon>
                <v-icon v-if="resource.type === 'link'" class="mr-2">mdi-link-variant</v-icon>
                {{ resource.title ? resource.title : "Untitled"}}
              </h1>
              <!-- <v-icon class="align-self-start mt-2">mdi-dots-horizontal</v-icon> -->
              <v-menu bottom offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" class="mt-1">
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
                  <v-list-item link>
                    <v-list-item-action>
                      <v-icon color="blue">mdi-export</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Export</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    link
                    @click="selecting = true; resourceToMove = resource"
                  >
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
            <v-row dense>
              <v-col cols="auto" v-if="resource.tags.length == 0">
                <v-card color="primary" class="px-1 py-1" dark>
                  <v-icon small class="ml-1">mdi-tag</v-icon>
                  <span class="px-1">No tags</span>
                </v-card>
              </v-col>

              <v-col cols="auto" v-for="(tag, index) in resource.tags" :key="index">
                <v-card color="primary" class="px-1 py-1" dark>
                  <v-icon small class="ml-1">mdi-tag</v-icon>
                  <span class="px-1">{{ tag }}</span>
                </v-card>
              </v-col>
            </v-row>
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

import axios from "axios";
import { Auth } from "aws-amplify";
import Fuse from "fuse.js";

export default {
  components: {
    LoadingDialog,
    ConfirmDialog,
    NamespaceSelectorDialog,
  },
  props: ["drawer"],
  computed: {
    searchResults: function () {
      var vm = this;
      var filteredResources = vm.resources.filter((e) =>
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
        keys: ["title", "tags"],
      };
      const fuse = new Fuse(filteredResources, options);
      const result = fuse.search(vm.query);
      const finalResult = result.map((a) => a.item);
      vm.searchResultsLength = finalResult.length;
      if (vm.focusIndex > vm.searchResultsLength - 1) {
        vm.focusIndex = vm.searchResultsLength - 1;
      }
      return finalResult;
    },
    activeNamespace: function () {
      return this.$store.getters.activeNamespace;
    },
  },
  data: () => ({
    query: "",
    fab: false,
    creating: false,
    deleting: false,
    selecting: false,
    moving: false,
    confirmDeleteDialog: false,
    resourceToDelete: null,
    resourceToMove: null,
    loading: true,
    resources: [],
    focusIndex: -1,
    searchResultsLength: 0,
    hotkeysActive: true,
  }),
  mounted() {
    var vm = this;
    vm._keyListener = function (e) {
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
  },
  methods: {
    ctrlJ: function (event) {
      event.preventDefault();
      console.log("ctrl j");
    },
    ctrlK: function (event) {
      event.preventDefault();
      console.log("ctrl k");
    },
    getResources: function () {
      var vm = this;
      Auth.currentAuthenticatedUser()
        .then((data) => {
          axios({
            method: vm.$variables.api.getResources.method,
            url: vm.$variables.api.getResources.url,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken,
            },
          })
            .then((response) => {
              vm.resources = response.data.resources;
              vm.loading = false;
              sessionStorage.setItem(
                vm.$route.fullPath + ".resources",
                JSON.stringify(response.data.resources)
              );
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },

    scrollFocusToCenter: function () {
      const focused = document.getElementById("focused-resource");
      focused.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });
    },
    incrementFocus: function () {
      var vm = this;
      if (vm.focusIndex < vm.searchResultsLength - 1) {
        vm.focusIndex++;
      }
      vm.scrollFocusToCenter();
    },
    decrementFocus: function () {
      var vm = this;
      if (vm.focusIndex > -1) {
        vm.focusIndex--;
      }
      vm.scrollFocusToCenter();
    },
    openInNewTab: function (url) {
      var win = window.open(url, "_blank");
      win.focus();
    },
    viewResource: function (resource) {
      var vm = this;
      if (resource.type === "link") {
        vm.openInNewTab(resource.content);
      } else {
        vm.$router.push({
          name: "Resource",
          params: { resource: resource, resource_id: resource.resource_id },
        });
      }
    },
    editResource: function (resource) {
      var vm = this;
      vm.$router.push({
        name: "Resource",
        params: {
          resource: resource,
          resource_id: resource.resource_id,
          edit: true,
        },
      });
    },
    createResource: function (type) {
      var vm = this;
      vm.creating = true;
      Auth.currentAuthenticatedUser()
        .then((data) => {
          axios({
            method: vm.$variables.api.createResource.method,
            url: vm.$variables.api.createResource.url,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken,
            },
            data: {
              type: type,
              namespace: vm.activeNamespace.namespace_id,
            },
          })
            .then((response) => {
              var resource = response.data.resource;
              vm.$router.push({
                name: "Resource",
                params: {
                  resource: resource,
                  resource_id: resource.resource_id,
                  edit: true,
                },
              });
            })
            .catch((err) => {
              vm.loading = false;
              console.error(err);
            });
        })
        .catch((err) => {
          vm.loading = false;
          console.log(err);
        });
    },
    deleteResource: function () {
      var vm = this;
      vm.confirmDeleteDialog = false;
      vm.deleting = true;
      Auth.currentAuthenticatedUser()
        .then((data) => {
          axios({
            method: vm.$variables.api.deleteResource.method,
            url:
              vm.$variables.api.deleteResource.url +
              vm.resourceToDelete.resource_id,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken,
            },
          })
            .then((response) => {
              console.log(response);
              vm.deleting = false;
              vm.resources = vm.resources.filter(
                (e) => e !== vm.resourceToDelete
              );
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    moveResource: function(namespace_id) {
      var vm = this
      vm.selecting = false
      vm.moving = true
      vm.resourceToMove.namespace = namespace_id
      Auth.currentAuthenticatedUser()
        .then((data) => {
          axios({
            method: vm.$variables.api.updateResource.method,
            url:
              vm.$variables.api.updateResource.url +
              vm.resourceToMove.resource_id,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken,
            },
            data: {
              resource: vm.resourceToMove
            }
          })
            .then((response) => {
              console.log(response);
              vm.moving = false
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss">
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.focused-resource-dark {
  outline-style: solid;
  outline-color: white;
}

.focused-resource-light {
  outline-style: solid;
  outline-color: #212121;
}
</style>