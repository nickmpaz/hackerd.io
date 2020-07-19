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
        <v-btn fab dark large color="success" @click="createNote">
          <v-icon>mdi-note-text</v-icon>
        </v-btn>
        <v-btn fab dark large color="success" @click="createNote">
          <v-icon>mdi-link-variant</v-icon>
        </v-btn>
      </v-speed-dial>

      <v-row justify="center" class="my-12">
        <v-col cols="12" md="10" xl="8">
          <v-text-field label="Search" solo single-line v-model="query"></v-text-field>
          <v-card
            v-for="(note, index) in searchResults"
            :key="index"
            class="px-4 pt-1 pb-2 mb-4"
            @click="viewNote(note.note_id)"
            :ripple="false"
          >
            <div class="d-flex">
              <h1 class="flex-grow-1">
                <v-icon class="mr-2">mdi-note-text</v-icon>
                {{ note.title }}
              </h1>
              <!-- <v-icon class="align-self-start mt-2">mdi-dots-horizontal</v-icon> -->
              <v-menu bottom offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon dark v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon color="green">mdi-pencil</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon color="blue">mdi-export</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Export</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
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
        // includeScore: true,
        // Search in `author` and in `tags` array
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
            console.log(response);
            vm.notes = response.data.notes;
            vm.doneLoading = true;
            sessionStorage.setItem(
              vm.$route.fullPath + ".notes",
              JSON.stringify(response.data.notes)
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
  created() {
    var vm = this;
    // check for page content in session storage
    if (sessionStorage.getItem(vm.$route.fullPath + ".notes")) {
      console.log("found it ");
      vm.doneLoading = true;
      vm.notes = JSON.parse(
        sessionStorage.getItem(vm.$route.fullPath + ".notes")
      );
    }
  },
  methods: {
    viewNote: async function(noteId) {
      var vm = this;
      // FIXME this makes things feel better?
      // await new Promise(r => setTimeout(r, 150));
      vm.$router.push({
        name: "Note",
        params: { note_id: noteId }
      });
    },
    createNote: function() {
      var vm = this;
      vm.creating = true;
      Auth.currentAuthenticatedUser()
        .then(data => {
          console.log(data);
          axios({
            method: "post",
            url: vm.$variables.api.createNote,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken
            }
          })
            .then(response => {
              vm.$router.push({
                name: "Note",
                params: { note_id: response.data.note_id }
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
