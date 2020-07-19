<template>
  <v-container fluid>
    <loading-dialog :active="!doneLoading" message="Loading" />
    <loading-dialog :active="deleting" message="Deleting" />
    <confirm-dialog
      :active="confirmDeleteDialog"
      prompt="Delete Note?"
      confirmMessage="delete"
      declineMessage="cancel"
      @confirm="deleteNote"
      @decline="confirmDeleteDialog = false"
    />
    <div v-show="doneLoading">
      <!-- floating action buttons -->
      <v-speed-dial
        v-model="fab"
        fixed
        bottom
        right
        direction="top"
        transition="slide-y-reverse-transition"
        class="ma-6"
        v-if="mode === 'show'"
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="primary" dark fab large>
            <v-icon v-if="fab">mdi-close</v-icon>
            <v-icon v-else>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-btn fab dark large color="green" @click="editDocument">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn fab dark large color="blue" @click="renderMarkdown">
          <v-icon>mdi-export</v-icon>
        </v-btn>
        <v-btn fab dark large color="red" @click="confirmDeleteDialog = true">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-speed-dial>
      <v-btn
        fab
        dark
        fixed
        bottom
        right
        large
        color="success"
        @click="saveDocument"
        class="ma-6"
        v-if="mode === 'edit'"
      >
        <v-icon large>mdi-check</v-icon>
      </v-btn>
      <!-- main content -->
      <v-row justify="center">
        <v-col cols="12" md="10" xl="8">
          <h1 v-if="mode === 'show'">{{ note.title }}</h1>
          <div v-if="mode === 'edit'">
            <v-text-field v-model="note.title" class="tag-input" label="Title" single-line solo></v-text-field>
            <v-text-field
              v-model="tagInput"
              @keydown.enter="addTag()"
              class="tag-input"
              label="Add a tag"
              single-line
              solo
            ></v-text-field>
          </div>
          <v-row dense class="mb-3 mt-1">
            <v-col cols="auto" v-if="note.tags.length == 0">
              <v-card color="primary" class="px-1 py-1" dark>
                <v-icon small class="ml-1">mdi-tag</v-icon>
                <span class="px-1">No tags</span>
              </v-card>
            </v-col>
            <v-col cols="auto" v-for="(tag, index) in note.tags" :key="index">
              <v-card color="primary" class="px-1 py-1" dark>
                <v-icon v-if="mode === 'edit'" @click="removeTag(tag)">mdi-close</v-icon>
                <v-icon v-if="mode === 'show'" small class="ml-1">mdi-tag</v-icon>
                <span class="px-1">{{ tag }}</span>
              </v-card>
            </v-col>
          </v-row>
          <v-card
            :class="'px-8 pb-8 pt-4 ' + (this.$vuetify.theme.dark ? 'markdown-body-dark' : 'markdown-body-light')"
          >
            <div class="d-flex justify-end mb-3">Updated at: {{ localUpdatedAt }}</div>
            <div v-html="renderedMarkdown" v-show="mode === 'show'" class="line-numbers"></div>
            <div v-if="mode === 'edit'">
              <textarea
                id="note-editor"
                :rows="note.document.split(/\r\n|\r|\n/).length"
                v-model="note.document"
                spellcheck="false"
              ></textarea>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import prism from "prismjs";
import axios from "axios";
import { Auth } from "aws-amplify";
import LoadingDialog from "../components/LoadingDialog";
import ConfirmDialog from "../components/ConfirmDialog";

export default {
  components: {
    LoadingDialog,
    ConfirmDialog,
  },
  data: () => ({
    EditLinkDialog: false,
    renderedMarkdown: "",
    confirmDeleteDialog: false,
    deleting: false,
    fab: false,
    doneLoading: false,
    tagInput: "",
    mode: "show",
    note: {
      title: "",
      tags: [],
      document: ""
    }
  }),
  computed: {
    localUpdatedAt: function() {
      var vm = this;
      var d = new Date(parseInt(vm.note.updated_at) * 1000);
      return d;
    }
  },
  beforeCreate() {
    var vm = this;
    Auth.currentAuthenticatedUser()
      .then(data => {
        axios({
          method: "get",
          url: vm.$variables.api.getNote + vm.$route.params.note_id,
          headers: {
            Authorization: data.signInUserSession.idToken.jwtToken
          },
          data: {}
        })
          .then(async function(response) {
            vm.note = response.data.note;
            await vm.renderMarkdown();
            vm.doneLoading = true;
            sessionStorage.setItem(
              vm.$route.fullPath + ".note",
              JSON.stringify(vm.note)
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
  async created() {
    var vm = this;
    console.log(vm.$route);
    // check for page content in session storage
    if (sessionStorage.getItem(vm.$route.fullPath + ".note")) {
      vm.note = JSON.parse(
        sessionStorage.getItem(vm.$route.fullPath + ".note")
      );
      await vm.renderMarkdown();
      vm.doneLoading = true;
    }
  },
  methods: {
    renderMarkdown: async function() {
      var vm = this;
      vm.renderedMarkdown = vm.$md.render(vm.note.document);
      // prism.highlightAll() renders the prism plugins 
      // (they don't get put in during standard highlighting that happens when markdown is rendered)
      await new Promise(r => setTimeout(r, 0)); // wait for renderedMarkdown to be put on DOM
      prism.highlightAll();
    },
    addTag: function() {
      var vm = this;
      if (!vm.note.tags.includes(vm.tagInput)) {
        vm.note.tags.push(vm.tagInput.toLowerCase());
        vm.note.tags.sort();
      }
      vm.tagInput = "";
    },
    removeTag: function(tag) {
      var vm = this;
      vm.note.tags = vm.note.tags.filter(e => e !== tag);
      document.activeElement.blur(); // stop next tag from getting button focus after you remove a tag
    },
    editDocument: function() {
      var vm = this;
      vm.mode = "edit";
      vm.fab = false;
    },
    saveDocument: async function() {
      var vm = this;
      await vm.renderMarkdown();
      vm.mode = "show";
      sessionStorage.setItem(
        vm.$route.fullPath + ".note",
        JSON.stringify(vm.note)
      );
      vm.updateNote();
    },
    updateNote: function() {
      var vm = this;
      Auth.currentAuthenticatedUser()
        .then(data => {
          axios({
            method: "post",
            url: vm.$variables.api.updateNote + vm.$route.params.note_id,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken
            },
            data: {
              note: vm.note
            }
          })
            .then(response => {
              console.log(response);
              // correct the updated_at time with new time from server
              vm.note.updated_at = response.data.updated_at;
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteNote: function() {
      var vm = this;
      vm.confirmDeleteDialog = false;
      vm.deleting = true;
      Auth.currentAuthenticatedUser()
        .then(data => {
          axios({
            method: "delete",
            url: vm.$variables.api.updateNote + vm.$route.params.note_id,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken
            }
          })
            .then(response => {
              console.log(response);
              vm.$router.push({ name: "Index" });
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
.tag-input {
  height: 55px;
}
</style>
