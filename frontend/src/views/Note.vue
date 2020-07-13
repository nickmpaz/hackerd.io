<template>
  <v-container fluid>
    <loading-dialog :active="!doneLoading" message="Loading" />
    <div v-if="doneLoading">
      <v-btn
        fab
        dark
        fixed
        bottom
        right
        large
        color="primary"
        @click.stop="toggleMode"
        class="ma-6"
      >
        <v-icon v-if="mode === 'show'" large>mdi-pencil</v-icon>
        <v-icon v-if="mode === 'edit'" large>mdi-check</v-icon>
      </v-btn>
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
          <v-row class="mb-2">
            <v-col cols="auto" v-if="note.tags.length == 0">
              <v-card class="px-1 py-1">
                <span class="px-1">No tags</span>
              </v-card>
            </v-col>

            <v-col cols="auto" v-for="(tag, index) in note.tags" :key="index">
              <v-card class="px-1 py-1">
                <v-icon v-if="mode === 'edit'" @click.stop="removeTag(tag)">mdi-close</v-icon>
                <v-icon v-if="mode === 'show'" small class="ml-1">mdi-tag</v-icon>
                <span class="px-1">{{ tag }}</span>
              </v-card>
            </v-col>
          </v-row>
          <v-card class="px-8 pb-8 pt-4 markdown-body-dark">
            <div class="d-flex justify-end mb-3">Last Updated: {{ localUpdatedAt }}</div>
            <div v-html="rawHTML" v-if="mode === 'show'"></div>
            <div v-if="mode === 'edit'">
              <v-textarea v-model="note.document" solo flat auto-grow></v-textarea>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import axios from "axios";
import { Auth } from "aws-amplify";
import LoadingDialog from "../components/LoadingDialog";

export default {
  components: {
    LoadingDialog
  },
  data: () => ({
    doneLoading: false,
    tagInput: "",
    mode: "show",
    note: null
  }),
  computed: {
    localUpdatedAt: function() {
      var vm = this
      var d = new Date(parseInt(vm.note.updated_at) * 1000)
      return d
    },
    rawHTML: function() {
      var md = MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function(str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value;
            } catch (__) {
              console.log("highlight error");
            }
          }
          return ""; // use external default escaping
        }
      });
      var result = md.render(this.note.document);
      return result;
    }
  },
  beforeCreate() {
    var vm = this;
    Auth.currentAuthenticatedUser()
      .then(data => {
        axios({
          method: "get",
          url: vm.$api.getNote + vm.$route.params.note_id,
          headers: {
            Authorization: data.signInUserSession.idToken.jwtToken
          },
          data: {}
        })
          .then(response => {
            vm.note = response.data.note;
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
    addTag: function() {
      var vm = this;
      if (!vm.note.tags.includes(vm.tagInput)) {
        // FIXME bad runtime, insert sorted instead
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
    toggleMode: function() {
      var vm = this;
      if (vm.mode === "show") {
        vm.mode = "edit";
      } else if (vm.mode === "edit") {
        vm.mode = "show";
        vm.updateNote();
      }
    },
    updateNote: function() {
      var vm = this;
      Auth.currentAuthenticatedUser()
        .then(data => {
          axios({
            method: "post",
            url: vm.$api.updateNote + vm.$route.params.note_id,
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
              vm.note.updated_at = response.data.updated_at
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
@import "../styles/markdown-light.scss";
@import "../styles/markdown-dark.scss";

.markdown-body-light {
  @import "../../node_modules/highlight.js/scss/arduino-light.scss";
}

.markdown-body-dark {
  @import "../../node_modules/highlight.js/scss/vs2015.scss";
}

.tag-input {
  height: 55px;
}
</style>
