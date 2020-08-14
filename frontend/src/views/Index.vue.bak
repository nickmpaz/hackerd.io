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
        <v-btn fab dark large color="success" @click="createNote('markdown')">
          <v-icon>mdi-note-text</v-icon>
        </v-btn>
        <v-btn fab dark large color="success" @click="createNote('link')">
          <v-icon>mdi-link-variant</v-icon>
        </v-btn>
      </v-speed-dial>

      <v-row justify="center" class="my-12">
        <v-col cols="12" md="10" xl="8">
          <v-text-field label="Search" solo single-line v-model="query" class="mb-6"></v-text-field>
          <v-card
            v-for="(note, index) in searchResults"
            :key="index"
            class="px-4 pt-1 pb-2 mb-4"
            @click="note.type === 'markdown' ? viewNote(note.note_id) : openInNewTab(note.document)"
            :ripple="false"
            role="button"
          >
            <div class="d-flex">
              <h1 class="flex-grow-1">
                <v-icon v-if="note.type === 'markdown'" class="mr-2">mdi-note-text</v-icon>
                <v-icon v-if="note.type === 'link'" class="mr-2">mdi-link-variant</v-icon>
                {{ note.title }}
              </h1>
              <!-- <v-icon class="align-self-start mt-2">mdi-dots-horizontal</v-icon> -->
              <v-menu bottom offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on" class="mt-1">
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item link @click="editNote(note.note_id)">
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
              <v-col cols="auto" v-if="note.tags.length == 0">
                <v-card color="primary" class="px-1 py-1" dark>
                  <v-icon small class="ml-1">mdi-tag</v-icon>
                  <span class="px-1">No tags</span>
                </v-card>
              </v-col>

              <v-col cols="auto" v-for="(tag, index) in note.tags" :key="index">
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
    LoadingDialog
  },
  computed: {
    searchResults: function() {
      var vm = this;
      if (vm.query === "") {
        return vm.notes;
      }
      const options = {
        threshold: 0.25,
        keys: ["title", "tags"]
      };
      const fuse = new Fuse(this.notes, options);
      const result = fuse.search(vm.query);
      return result.map(a => a.item);
    }
  },
  data: () => ({
    query: "",
    fab: false,
    creating: false,
    doneLoading: false,
    notes: []
  }),
  beforeCreate() {
    var vm = this;
    Auth.currentAuthenticatedUser()
      .then(data => {
        axios({
          method: "get",
          url: vm.$variables.api.getNotes,
          headers: {
            Authorization: data.signInUserSession.idToken.jwtToken
          }
        })
          .then(response => {
            vm.notes = response.data.notes;
            vm.doneLoading = true;
            sessionStorage.setItem(
              vm.$route.fullPath + ".notes",
              JSON.stringify(response.data.notes)
            );
          })
          .catch(err => {
            console.log('catch')
            console.error(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  },
  created() {
    var vm = this;
    // check for page content in session storage
    if (sessionStorage.getItem(vm.$route.fullPath + ".notes")) {
      vm.notes = JSON.parse(
        sessionStorage.getItem(vm.$route.fullPath + ".notes")
      );
      vm.doneLoading = true;
    }
  },
  methods: {
    openInNewTab: function(url) {
      var win = window.open(url, "_blank");
      win.focus();
    },
    viewNote: function(noteId) {
      var vm = this;
      vm.$router.push({
        name: "Note",
        params: { note_id: noteId }
      });
    },
    editNote: function(noteId) {
      var vm = this;
      vm.$router.push({
        name: "Note",
        params: { note_id: noteId , mode: 'edit'}
      });
    },
    createNote: function(note_type) {
      var vm = this;
      vm.creating = true;
      Auth.currentAuthenticatedUser()
        .then(data => {
          axios({
            method: "post",
            url: vm.$variables.api.createNote,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken
            },
            data: {
              note_type: note_type
            }
          })
            .then(response => {
              vm.$router.push({
                name: "Note",
                params: { note_id: response.data.note_id, mode: "edit" }
              });
            })
            .catch(err => {
              vm.loading = false;
              console.error(err);
            });
        })
        .catch(err => {
          vm.loading = false;
          console.log(err);
        });
    }
  }
};
</script>
