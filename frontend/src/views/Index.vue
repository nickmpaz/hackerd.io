<template>
  <v-container fluid>
    <loading-dialog :active="loading" message="Loading" />
    <loading-dialog :active="creating" message="Creating" />
    <loading-dialog :active="deleting" message="Deleting" />
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
          <v-btn v-model="fab" color="primary" dark fab large>
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-btn fab dark large color="success" @click="createResource('note')">
          <v-icon>mdi-note-text</v-icon>
        </v-btn>
        <v-btn fab dark large color="success" @click="createResource('link')">
          <v-icon>mdi-link-variant</v-icon>
        </v-btn>
      </v-speed-dial>

      <v-row justify="center" class="my-12">
        <v-col cols="12" md="10" xl="8">
          <v-text-field label="Search" solo single-line v-model="query" class="mb-6"></v-text-field>
          <v-card
            v-for="(resource, index) in searchResults"
            :key="index"
            class="px-4 pt-1 pb-2 mb-4"
            @click="viewResource(resource)"
            :ripple="false"
            role="button"
          >
            <div class="d-flex">
              <h1 class="flex-grow-1 truncate">
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

import axios from "axios";
import { Auth } from "aws-amplify";
import Fuse from "fuse.js";

export default {
  components: {
    LoadingDialog,
    ConfirmDialog,
  },
  computed: {
    searchResults: function () {
      var vm = this;
      if (vm.query === "") {
        return vm.resources;
      }
      const options = {
        threshold: 0.25,
        keys: ["title", "tags"],
      };
      const fuse = new Fuse(vm.resources, options);
      const result = fuse.search(vm.query);
      return result.map((a) => a.item);
    },
  },
  data: () => ({
    query: "",
    fab: false,
    creating: false,
    deleting: false,
    confirmDeleteDialog: false,
    resourceToDelete: null,
    loading: true,
    resources: [],
    focusIndex: 0,
  }),
  mounted() {
    this._keyListener = function (e) {
      if (e.key === "j" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault(); 
        console.log('yeet')
      } else if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault(); 
        console.log('yeet')
      }
    };
    document.addEventListener("keydown", this._keyListener.bind(this));
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this._keyListener);
  },
  beforeCreate() {
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
  created() {
    var vm = this;
    // check for page content in session storage
    if (sessionStorage.getItem(vm.$route.fullPath + ".resources")) {
      vm.resources = JSON.parse(
        sessionStorage.getItem(vm.$route.fullPath + ".resources")
      );
      vm.loading = false;
    }
  },
  methods: {
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
        params: { resource: resource, resource_id: resource.resource_id },
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
            },
          })
            .then((response) => {
              var resource = response.data.resource;
              console.log();
              vm.$router.push({
                name: "Resource",
                params: {
                  resource: resource,
                  resource_id: resource.resource_id,
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
              // vm.resourceToDelete = null
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
</style>