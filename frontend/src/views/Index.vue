<template>
  <v-container fluid>
    <loading-dialog :active="!doneLoading" message="Loading" />
    <loading-dialog :active="creating" message="Creating" />
    <div v-if="doneLoading">
      <v-btn
        fab
        dark
        fixed
        bottom
        right
        large
        color="primary"
        @click="createNote"
        class="ma-6"
      >
        <v-icon large>mdi-plus</v-icon>
      </v-btn>
      <v-row justify="center" class="my-12">
        <v-col cols="12" md="10" xl="8">
          <v-text-field label="Search" outlined v-model="query"></v-text-field>
          <v-card
            v-for="(note, index) in searchResults"
            :key="index"
            class="px-4 pt-1 mb-4"
            @click="viewNote(note.note_id)"
          >
            <h1>{{ note.title }}</h1>
            <v-row>
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
      var vm = this
      if (vm.query === "") {
        return vm.notes
      }
      const options = {
        // includeScore: true,
        // Search in `author` and in `tags` array
        threshold: 0.25,
        keys: ["title", "tags"]
      };
      const fuse = new Fuse(this.notes, options);
      const result = fuse.search(vm.query);
      return result.map(a => a.item)
    }
  },
  data: () => ({
    query: "",
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
          url: vm.$api.getNotes,
          headers: {
            Authorization: data.signInUserSession.idToken.jwtToken
          }
        })
          .then(response => {
            console.log(response);
            vm.notes = response.data.notes;
            vm.doneLoading = true;
          })
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    viewNote: async function(noteId) {
      var vm = this;
      // FIXME this makes things feel better? 
      await new Promise(r => setTimeout(r, 150));
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
            url: vm.$api.createNote,
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
