<template>
  <v-container fluid>
    <v-btn fab dark fixed bottom right large color="primary" @click.stop="toggleMode">
      <v-icon v-if="mode === 'show'" large>mdi-pencil</v-icon>
      <v-icon v-if="mode === 'edit'" large>mdi-check</v-icon>
    </v-btn>
    <v-row justify="center">
      <v-col cols="12" md="10" xl="8">
        <div v-if="mode === 'edit'">
          <v-form v-model="tagValid">
            <v-text-field
              v-model="tagInput"
              @keydown.enter="addTag()"
              class="tag-input"
              label="Add a tag"
              single-line
              solo
            ></v-text-field>
          </v-form>
        </div>
        <v-row class="mb-2">
          <v-col cols="auto" v-if="tags.length == 0">
            <v-card class="px-1 py-1">
              <span class="px-1">No tags</span>
            </v-card>
          </v-col>

          <v-col cols="auto" v-for="(tag, index) in tags" :key="index">
            <v-card class="px-1 py-1">
              <v-icon v-if="mode === 'edit'" @click.stop="removeTag(tag)">mdi-close</v-icon>
              <span class="px-1">{{ tag }}</span>
            </v-card>
          </v-col>
        </v-row>
        <v-card class="pa-12 markdown-body-light">
          <div v-html="rawHTML" v-if="mode === 'show'"></div>
          <div v-if="mode === 'edit'">
            <v-textarea v-model="markdown" solo flat auto-grow></v-textarea>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import axios from "axios";
import { Auth } from "aws-amplify";

export default {
  data: () => ({
    tagInput: "",
    mode: "show",
    tags: ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot"],
    markdown:
      '\n---\n__Advertisement :)__\n\n- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image\n  resize in browser.\n- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly\n  i18n with plurals support and easy syntax.\n\nYou will like those projects!\n\n---\n\n# h1 Heading 8-)\n## h2 Heading\n### h3 Heading\n#### h4 Heading\n##### h5 Heading\n###### h6 Heading\n\n\n## Horizontal Rules\n\n___\n\n---\n\n***\n\n\n## Typographic replacements\n\nEnable typographer option to see result.\n\n(c) (C) (r) (R) (tm) (TM) (p) (P) +-\n\ntest.. test... test..... test?..... test!....\n\n!!!!!! ???? ,,  -- ---\n\n"Smartypants, double quotes" and \'single quotes\'\n\n\n## Emphasis\n\n**This is bold text**\n\n__This is bold text__\n\n*This is italic text*\n\n_This is italic text_\n\n~~Strikethrough~~\n\n\n## Blockquotes\n\n\n> Blockquotes can also be nested...\n>> ...by using additional greater-than signs right next to each other...\n> > > ...or with spaces between arrows.\n\n\n## Lists\n\nUnordered\n\n+ Create a list by starting a line with `+`, `-`, or `*`\n+ Sub-lists are made by indenting 2 spaces:\n  - Marker character change forces new list start:\n    * Ac tristique libero volutpat at\n    + Facilisis in pretium nisl aliquet\n    - Nulla volutpat aliquam velit\n+ Very easy!\n\nOrdered\n\n1. Lorem ipsum dolor sit amet\n2. Consectetur adipiscing elit\n3. Integer molestie lorem at massa\n\n\n1. You can use sequential numbers...\n1. ...or keep all the numbers as `1.`\n\nStart numbering with offset:\n\n57. foo\n1. bar\n\n\n## Code\n\nInline `code`\n\nIndented code\n\n    // Some comments\n    line 1 of code\n    line 2 of code\n    line 3 of code\n\n\nBlock code "fences"\n\n```\nSample text here...\n```\n\nSyntax highlighting\n\n``` js\nvar foo = function (bar) {\n  return bar++;\n};\n\nconsole.log(foo(5));\n```\n\n## Tables\n\n| Option | Description |\n| ------ | ----------- |\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\nRight aligned columns\n\n| Option | Description |\n| ------:| -----------:|\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\n\n## Links\n\n[link text](http://dev.nodeca.com)\n\n[link with title](http://nodeca.github.io/pica/demo/ "title text!")\n\nAutoconverted link https://github.com/nodeca/pica (enable linkify to see)\n\n\n## Images\n\n![Minion](https://octodex.github.com/images/minion.png)\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")\n\nLike links, Images also have a footnote style syntax\n\n![Alt text][id]\n\nWith a reference later in the document defining the URL location:\n\n[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"\n\n\n## Plugins\n\nThe killer feature of `markdown-it` is very effective support of\n[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).\n\n\n### [Emojies](https://github.com/markdown-it/markdown-it-emoji)\n\n> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:\n>\n> Shortcuts (emoticons): :-) :-( 8-) ;)\n\nsee [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.\n\n\n### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)\n\n- 19^th^\n- H~2~O\n\n\n### [\\<ins>](https://github.com/markdown-it/markdown-it-ins)\n\n++Inserted text++\n\n\n### [\\<mark>](https://github.com/markdown-it/markdown-it-mark)\n\n==Marked text==\n\n\n### [Footnotes](https://github.com/markdown-it/markdown-it-footnote)\n\nFootnote 1 link[^first].\n\nFootnote 2 link[^second].\n\nInline footnote^[Text of inline footnote] definition.\n\nDuplicated footnote reference[^second].\n\n[^first]: Footnote **can have markup**\n\n    and multiple paragraphs.\n\n[^second]: Footnote text.\n\n\n### [Definition lists](https://github.com/markdown-it/markdown-it-deflist)\n\nTerm 1\n\n:   Definition 1\nwith lazy continuation.\n\nTerm 2 with *inline markup*\n\n:   Definition 2\n\n        { some code, part of Definition 2 }\n\n    Third paragraph of definition 2.\n\n_Compact style:_\n\nTerm 1\n  ~ Definition 1\n\nTerm 2\n  ~ Definition 2a\n  ~ Definition 2b\n\n\n### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)\n\nThis is HTML abbreviation example.\n\nIt converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.\n\n*[HTML]: Hyper Text Markup Language\n\n### [Custom containers](https://github.com/markdown-it/markdown-it-container)\n\n::: warning\n*here be dragons*\n:::\n'
  }),
  computed: {
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
      var result = md.render(this.markdown);
      return result;
    }
  },
  beforeCreate: () => {
    Auth.currentAuthenticatedUser()
      .then(data => {
        console.log(data);
        axios({
          method: "post",
          url:
            "https://ivwbrs4jr6.execute-api.us-east-1.amazonaws.com/dev/ping_auth",
          headers: {
            Authorization: data.signInUserSession.idToken.jwtToken
          },
          data: {
            idToken: data.signInUserSession.idToken.jwtToken
          }
        })
          .then(response => {
            console.log(response);
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
      if (!vm.tags.includes(vm.tagInput)) {
        // FIXME bad runtime, insert sorted instead
        vm.tags.push(vm.tagInput.toLowerCase());
        vm.tags.sort();
      }
      vm.tagInput = "";
    },
    removeTag: function(tag) {
      var vm = this;
      vm.tags = vm.tags.filter(e => e !== tag);
      document.activeElement.blur(); // stop next tag from getting button focus after you remove a tag
    },
    toggleMode: function() {
      var vm = this;
      if (vm.mode === "show") {
        vm.mode = "edit";
      } else if (vm.mode === "edit") {
        vm.mode = "show";
      }
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
