<template>
  <v-card
    :class="'fill-height ' + (this.$vuetify.theme.dark ? 'markdown-body-dark' : 'markdown-body-light')"
  >
    <div class="d-flex flex-column fill-height">
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
      <div class="px-6 py-3 flex-grow-1">
        <editor-content class="editor__content pt-3 fill-height" :editor="editor" />
      </div>
    </div>
  </v-card>
</template>

<script>
import { EditorContent, EditorMenuBar } from "tiptap";

export default {
  props: ["editor", "mode"],
  components: {
    EditorContent,
    EditorMenuBar,
  },
  methods: {
  },
};
</script>

<style>
</style>