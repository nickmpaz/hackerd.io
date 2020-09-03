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

    <!-- back button -->
    <div class="d-flex my-6">
      <v-btn width="150" @click="$router.push({name: 'Index'})">
        <v-icon left>mdi-arrow-left</v-icon>Back
      </v-btn>
      <v-spacer></v-spacer>
      <responsive-button-group
        v-if="mode === 'read'"
        :items="actionItems"
        :collapse="$vuetify.breakpoint.mdAndDown"
        menuText="Actions"
        menuIcon="mdi-chevron-down"
      />
      <v-btn color="secondary" width="150" @click="save" v-else>
        <v-icon left color="green">mdi-check</v-icon>Save
      </v-btn>
    </div>
    <!-- header card -->
    <v-card class="px-6 py-4 mb-6">
      <resource-header v-if="mode === 'read'" :resource="resource" />
      <editable-resource-header v-if="mode === 'write'" :resource="resource" />
    </v-card>
    <!-- editor card -->
    <no-content
      v-if=" editor.getHTML() === '<pre><code></code></pre>' && mode === 'read' "
      callToAction="Click here to start editing."
      @engage="mode = 'write'"
    />
    <v-card
      v-else
      :class="(this.$vuetify.theme.dark ? 'markdown-body-dark' : 'markdown-body-light')"
    >
      <div class="px-6 py-3">
        <editor-content class="editor__content pt-3" :editor="editor" />
      </div>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import { Auth } from "aws-amplify";
import { Editor, EditorContent } from "tiptap";
import { CodeBlockHighlight } from "tiptap-extensions";
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
import NoContent from "@/components/NoContent";
import ResponsiveButtonGroup from "@/components/ResponsiveButtonGroup";

export default {
  components: {
    EditorContent,
    ConfirmDialog,
    LoadingDialog,
    EditableResourceHeader,
    ResourceHeader,
    NoContent,
    ResponsiveButtonGroup,
  },
  props: ["resource", "editMode"],
  data() {
    var vm = this;
    console.log("content", vm.resource.content);
    vm.resource.content = {
      type: "doc",
      content: [
        {
          type: "code_block",
          content: vm.resource.content
            ? [
                {
                  type: "text",
                  text: vm.resource.content,
                },
              ]
            : [],
        },
      ],
    };
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
        ],
        content: vm.resource.content,
      }),
      actionItems: [
        {
          text: "Edit",
          icon: "mdi-pencil",
          buttonColor: "none",
          buttonWidth: "150",
          iconColor: "green",
          function: function () {
            vm.edit();
          },
        },
        {
          text: "Export",
          icon: "mdi-export",
          buttonColor: "none",
          buttonWidth: "150",
          iconColor: "blue",
          function: function () {
            vm.exportResource();
          },
        },
        {
          text: "Delete",
          icon: "mdi-delete",
          buttonColor: "none",
          buttonWidth: "150",
          iconColor: "red",
          function: function () {
            vm.confirmDeleteDialog = true;
          },
        },
      ],
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
      try {
        vm.resource.content = vm.editor.getJSON().content[0].content[0].text;
      } catch {
        vm.resource.content = "";
      }
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