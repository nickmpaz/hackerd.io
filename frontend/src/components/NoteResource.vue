<template>
  <div>
    <!-- dialogs -->
    <loading-dialog :active="deleting" message="Deleting" />
    <confirm-dialog
      :active="confirmDeleteDialog"
      prompt="Delete Note?"
      confirmMessage="delete"
      declineMessage="cancel"
      @confirm="deleteResource"
      @decline="confirmDeleteDialog = false"
    />
    <!-- main content -->
    <v-row justify="center">
      <v-col cols="12" md="10" xl="8">
        <!-- back button -->
        <div class="d-flex my-6">
          <v-btn color="secondary" width="150" @click="$router.push({name: 'Index'})">
            <div class="d-flex justify-space-between align-center">
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              <span class="mr-2">Back</span>
            </div>
          </v-btn>
          <v-spacer></v-spacer>
          <v-menu bottom offset-y v-if="mode === 'read'">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on" width="150">
                <div class="d-flex justify-space-between align-center">
                  <v-icon class="mr-2">mdi-chevron-down</v-icon>
                  <span class="mr-2">Actions</span>
                </div>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item link @click="edit">
                <v-list-item-action>
                  <v-icon color="green">mdi-pencil</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item link @click="exportResource">
                <v-list-item-action>
                  <v-icon color="blue">mdi-export</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Export</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item link @click="confirmDeleteDialog = true">
                <v-list-item-action>
                  <v-icon color="red">mdi-delete</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn color="secondary" width="150" @click="save" v-else>
            <div class="d-flex justify-space-between align-center">
              <v-icon class="mr-2">mdi-check</v-icon>
              <span class="mr-2">Save</span>
            </div>
          </v-btn>
        </div>
        <!-- header card -->
        <v-card class="px-6 py-4 mb-6">
          <resource-header v-if="mode === 'read'" :resource="resource" />
          <editable-resource-header v-if="mode === 'write'" :resource="resource" />
        </v-card>
        <!-- editor card -->
        <v-card :class="(this.$vuetify.theme.dark ? 'markdown-body-dark' : 'markdown-body-light')">
          <v-card v-if="mode === 'write'" color="secondary" class="pa-1">
            <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
              <div class="menubar">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      :color="isActive.bold() ? 'primary' : 'secondary'"
                      @click="commands.bold"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-format-bold</v-icon>
                    </v-btn>
                  </template>
                  <span>Bold</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      :color="isActive.italic() ? 'primary' : 'secondary'"
                      @click="commands.italic"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-format-italic</v-icon>
                    </v-btn>
                  </template>
                  <span>Italic</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      :color="isActive.strike() ? 'primary' : 'secondary'"
                      @click="commands.strike"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-format-strikethrough</v-icon>
                    </v-btn>
                  </template>
                  <span>Strikethrough</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      :color="isActive.underline() ? 'primary' : 'secondary'"
                      @click="commands.underline"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-format-underline</v-icon>
                    </v-btn>
                  </template>
                  <span>Underline</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      :color="isActive.code() ? 'primary' : 'secondary'"
                      @click="commands.code"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-code-braces</v-icon>
                    </v-btn>
                  </template>
                  <span>Code</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      :color="isActive.paragraph() ? 'primary' : 'secondary'"
                      @click="commands.paragraph"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-format-pilcrow</v-icon>
                    </v-btn>
                  </template>
                  <span>Paragraph</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      :color="isActive.heading({ level: 1 }) ? 'primary' : 'secondary'"
                      @click="commands.heading({ level: 1 })"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-format-header-1</v-icon>
                    </v-btn>
                  </template>
                  <span>H1</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      :color="isActive.heading({ level: 2 }) ? 'primary' : 'secondary'"
                      @click="commands.heading({ level: 2 })"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-format-header-2</v-icon>
                    </v-btn>
                  </template>
                  <span>H2</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      :color="isActive.heading({ level: 3 }) ? 'primary' : 'secondary'"
                      @click="commands.heading({ level: 3 })"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-format-header-3</v-icon>
                    </v-btn>
                  </template>
                  <span>H3</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      :color="isActive.bullet_list() ? 'primary' : 'secondary'"
                      @click="commands.bullet_list"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-format-list-bulleted-square</v-icon>
                    </v-btn>
                  </template>
                  <span>Bullet List</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      :color="isActive.ordered_list() ? 'primary' : 'secondary'"
                      @click="commands.ordered_list"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-format-list-numbered</v-icon>
                    </v-btn>
                  </template>
                  <span>Ordered List</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      :color="isActive.blockquote() ? 'primary' : 'secondary'"
                      @click="commands.blockquote"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-format-quote-close</v-icon>
                    </v-btn>
                  </template>
                  <span>Blockquote</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      :color="isActive.code_block() ? 'primary' : 'secondary'"
                      @click="commands.code_block"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-code-json</v-icon>
                    </v-btn>
                  </template>
                  <span>Code Block</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      @click="commands.horizontal_rule"
                      color="secondary"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-minus</v-icon>
                    </v-btn>
                  </template>
                  <span>Horizontal Rule</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      @click="commands.undo"
                      color="secondary"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-undo</v-icon>
                    </v-btn>
                  </template>
                  <span>Undo</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      class="menubar__button"
                      @click="commands.redo"
                      color="secondary"
                    >
                      <v-icon :large="$vuetify.breakpoint.lgAndUp">mdi-redo</v-icon>
                    </v-btn>
                  </template>
                  <span>Redo</span>
                </v-tooltip>
              </div>
            </editor-menu-bar>
          </v-card>
          <div class="px-6 pb-4 pt-6">
            <editor-content class="editor__content" :editor="editor" />
            <div
              v-if=" (resource.content === '' || resource.content === '<p></p>') && mode === 'read' "
              class="d-flex justify-center mb-12"
            >
              <span class="title">There's nothing here yet. <span @click="mode = 'write'" class="cursor-pointer primary--text">Click here to start editing.</span> </span>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import { Auth } from "aws-amplify";
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import {
  CodeBlockHighlight,
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from "tiptap-extensions";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import xml from "highlight.js/lib/languages/xml";

import LoadingDialog from "../components/LoadingDialog";
import EditableResourceHeader from "../components/EditableResourceHeader";
import ResourceHeader from "../components/ResourceHeader";
import ConfirmDialog from "../components/ConfirmDialog";

export default {
  components: {
    EditorContent,
    EditorMenuBar,
    ConfirmDialog,
    LoadingDialog,
    EditableResourceHeader,
    ResourceHeader,
  },
  props: ["resource", "editMode"],
  data() {
    return {
      mode: "read",
      fab: false,
      confirmDeleteDialog: false,
      deleting: false,
      editor: new Editor({
        editable: false,
        extensions: [
          new CodeBlockHighlight({
            languages: {
              bash,
              css,
              dockerfile,
              java,
              javascript,
              python,
              sql,
              xml,
            },
          }),
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
        ],
        content: this.resource.content,
      }),
    };
  },
  watch: {
    mode() {
      var vm = this;
      vm.editor.setOptions({
        editable: vm.mode == "read" ? false : true,
      });
    },
  },
  mounted() {
    var vm = this;
    this._keyListener = function (e) {
      if (e.key === "i" && (e.ctrlKey || e.metaKey) && vm.mode === "read") {
        e.preventDefault();
        vm.edit();
      } else if (
        e.key === "s" &&
        (e.ctrlKey || e.metaKey) &&
        vm.mode === "write"
      ) {
        e.preventDefault();
        vm.save();
      } else if (e.key === "h" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        vm.$router.push({ name: "Index" });
      }
    };
    document.addEventListener("keydown", this._keyListener);
  },
  created() {
    var vm = this;
    if (vm.editMode) vm.mode = "write";
  },
  methods: {
    clearSelection: function () {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      } else if (document.selection) {
        document.selection.empty();
      }
    },
    edit: function () {
      var vm = this;
      vm.mode = "write";
      vm.fab = false;
    },
    save: function () {
      var vm = this;
      vm.resource.content = vm.editor.getHTML();
      Auth.currentAuthenticatedUser()
        .then((data) => {
          axios({
            method: vm.$variables.api.updateResource.method,
            url:
              vm.$variables.api.updateResource.url +
              vm.$route.params.resource_id,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken,
            },
            data: {
              resource: vm.resource,
            },
          })
            .then((response) => {
              console.log(response);
              // correct the updated_at time with new time from server
              vm.resource.updated_at = response.data.resource.updated_at;
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });

      vm.mode = "read";
      vm.clearSelection();
      console.log(vm.resource.content);
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
              vm.$route.params.resource_id,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken,
            },
          })
            .then((response) => {
              console.log(response);
              vm.$router.push({ name: "Index" });
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    exportResource: function () {
      var vm = this;
      vm.$utils.downloadObj(vm.resource, vm.resource.title);
    },
  },
  beforeDestroy() {
    this.editor.destroy();
    document.removeEventListener("keydown", this._keyListener);
  },
};
</script>

<style lang="scss">
@import "../styles/markdown-light.scss";
@import "../styles/markdown-dark.scss";

:focus {
  outline: none;
}

// this is for the editor menu buttons
.menubar__button.v-btn:not(.v-btn--round).v-size--default {
  padding: 0;
  min-width: 0;
  min-height: 0;
  height: 3em;
  width: 3em;
  margin: 0.25em;
}

.markdown-body-dark {
  pre {
    &::before {
      content: attr(data-language);
      text-transform: uppercase;
      display: block;
      text-align: right;
      font-weight: bold;
      font-size: 0.6rem;
    }
    code {
      color: white !important;
      @import "highlight.js/scss/atom-one-dark.scss";
    }
  }
}

.markdown-body-light {
  pre {
    &::before {
      content: attr(data-language);
      text-transform: uppercase;
      display: block;
      text-align: right;
      font-weight: bold;
      font-size: 0.6rem;
    }
    code {
      color: black !important;
      @import "highlight.js/scss/atom-one-light.scss";
    }
  }
}
</style>