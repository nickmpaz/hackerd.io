<template>
  <v-container fluid>
    <loading-dialog :active="!doneLoading" message="Loading" />
    <loading-dialog :active="creating" message="Creating" />
    <div v-if="doneLoading">
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
        <v-btn fab dark large color="success" @click="createResource('markdown')">
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
            @click="resource.type === 'markdown' ? viewNote(resource.resource_id) : openInNewTab(resource.content)"
            :ripple="false"
            role="button"
          >
            <div class="d-flex">
              <h1 class="flex-grow-1">
                <v-icon v-if="resource.type === 'markdown'" class="mr-2">mdi-note-text</v-icon>
                <v-icon v-if="resource.type === 'link'" class="mr-2">mdi-link-variant</v-icon>
                {{ resource.title }}
              </h1>
              <!-- <v-icon class="align-self-start mt-2">mdi-dots-horizontal</v-icon> -->
              <v-menu bottom offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" class="mt-1">
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item link @click="editNote(resource.resource_id)">
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
                  <v-list-item link>
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
import axios from "axios";
import { Auth } from "aws-amplify";
import Fuse from "fuse.js";

export default {
  components: {
    LoadingDialog,
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
      const fuse = new Fuse(this.resources, options);
      const result = fuse.search(vm.query);
      return result.map((a) => a.item);
    },
  },
  data: () => ({
    query: "",
    fab: false,
    creating: false,
    doneLoading: false,
    resources: [],
  }),
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
              vm.doneLoading = true;
              sessionStorage.setItem(
                vm.$route.fullPath + ".resources",
                JSON.stringify(response.data.resources)
              );
            })
            .catch((err) => {
              console.log("catch");
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
      vm.doneLoading = true;
    }
  },
  methods: {

    openInNewTab: function (url) {
      var win = window.open(url, "_blank");
      win.focus();
    },
    viewNote: function (resourceId) {
      var vm = this;
      vm.$router.push({
        name: "Note",
        params: { resource_id: resourceId },
      });
    },
    editNote: function (resourceId) {
      var vm = this;
      vm.$router.push({
        name: "Note",
        params: { resource_id: resourceId, mode: "edit" },
      });
    },
    createResource: function (resource_type) {
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
              resource_type: resource_type,
            },
          })
            .then((response) => {
              vm.$router.push({
                name: "Note",
                params: { resource_id: response.data.resource_id, mode: "edit" },
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
  },
};
</script>
