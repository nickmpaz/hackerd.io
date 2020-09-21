<template>
  <div class="d-flex flex-column fill-height">
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
      <v-btn color="secondary" width="125" @click="$utils.goBack">
        <v-icon left>mdi-arrow-left</v-icon>Back
      </v-btn>
      <v-spacer></v-spacer>
      <responsive-button-group
        v-if="mode === 'read'"
        :items="actionItems"
        :collapse="$vuetify.breakpoint.mdAndDown"
        menuText="Actions"
        menuIcon="mdi-chevron-down"
        menuWidth="125"
      />
      <v-btn color="secondary" width="125" @click="save" v-else>
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
      v-if="(editor.getHTML() === '' || editor.getHTML() === '<p></p>') && mode === 'read'"
      callToAction="Click here to start editing."
      @engage="mode = 'write'"
      class="flex-grow-1"
    />
    <tip-tap-editor v-else class="flex-grow-1" :editor="editor" :mode="mode" />
  </div>
</template>

<script>
import { Editor } from "tiptap";
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
import NoContent from "@/components/NoContent";
import ResponsiveButtonGroup from "@/components/ResponsiveButtonGroup";
import TipTapEditor from "@/components/TipTapEditor";

export default {
  components: {
    ConfirmDialog,
    LoadingDialog,
    EditableResourceHeader,
    ResourceHeader,
    NoContent,
    ResponsiveButtonGroup,
    TipTapEditor,
  },
  props: ["resource", "editMode"],
  data() {
    var vm = this;
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
      actionItems: [
        {
          text: "Edit",
          icon: "mdi-pencil",
          buttonColor: "none",
          buttonWidth: "125",
          iconColor: "green",
          function: function () {
            vm.edit();
          },
        },
        {
          text: "Export",
          icon: "mdi-export",
          buttonColor: "none",
          buttonWidth: "125",
          iconColor: "blue",
          function: function () {
            vm.exportResource();
          },
        },
        {
          text: "Delete",
          icon: "mdi-delete",
          buttonColor: "none",
          buttonWidth: "125",
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
  created() {
    var vm = this;
    if (vm.editMode) vm.mode = "write";
  },
  methods: {
    edit: function () {
      var vm = this;
      vm.mode = "write";
    },
    save: async function () {
      var vm = this;
      vm.mode = "read";
      await vm.$api.updateResource(
        vm.$route.params.stashId,
        vm.$route.params.resourceId,
        vm.resource.name,
        vm.resource.tags,
        vm.editor.getHTML()
      );
    },
    deleteResource: async function () {
      var vm = this;
      vm.confirmDeleteDialog = false;
      vm.deleting = true;
      await vm.$api.deleteResource(
        vm.$route.params.stashId,
        vm.$route.params.resourceId
      );
      vm.deleting = false;
      vm.$utils.goBack();
    },
    exportResource: function () {
      var vm = this;
      vm.$utils.downloadObj(vm.resource, vm.resource.name);
    },
  },
};
</script>

<style lang="scss">
@import "../styles/markdown-light.scss";
@import "../styles/markdown-dark.scss";

:focus {
  outline: none;
}

.ProseMirror {
  height: 100%;
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