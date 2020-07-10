<template>
<v-container class="fill-height" fluid>
    <v-row justify="center">
        <v-card class="pa-12 ma-12">
            <span v-html="rawHTML"></span>

        </v-card>
    </v-row>
</v-container>
</template>

<script>
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it'

export default {
    data: () => ({
        markdown: '\n---\n__Advertisement :)__\n\n- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image\n  resize in browser.\n- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly\n  i18n with plurals support and easy syntax.\n\nYou will like those projects!\n\n---\n\n# h1 Heading 8-)\n## h2 Heading\n### h3 Heading\n#### h4 Heading\n##### h5 Heading\n###### h6 Heading\n\n\n## Horizontal Rules\n\n___\n\n---\n\n***\n\n\n## Typographic replacements\n\nEnable typographer option to see result.\n\n(c) (C) (r) (R) (tm) (TM) (p) (P) +-\n\ntest.. test... test..... test?..... test!....\n\n!!!!!! ???? ,,  -- ---\n\n"Smartypants, double quotes" and \'single quotes\'\n\n\n## Emphasis\n\n**This is bold text**\n\n__This is bold text__\n\n*This is italic text*\n\n_This is italic text_\n\n~~Strikethrough~~\n\n\n## Blockquotes\n\n\n> Blockquotes can also be nested...\n>> ...by using additional greater-than signs right next to each other...\n> > > ...or with spaces between arrows.\n\n\n## Lists\n\nUnordered\n\n+ Create a list by starting a line with `+`, `-`, or `*`\n+ Sub-lists are made by indenting 2 spaces:\n  - Marker character change forces new list start:\n    * Ac tristique libero volutpat at\n    + Facilisis in pretium nisl aliquet\n    - Nulla volutpat aliquam velit\n+ Very easy!\n\nOrdered\n\n1. Lorem ipsum dolor sit amet\n2. Consectetur adipiscing elit\n3. Integer molestie lorem at massa\n\n\n1. You can use sequential numbers...\n1. ...or keep all the numbers as `1.`\n\nStart numbering with offset:\n\n57. foo\n1. bar\n\n\n## Code\n\nInline `code`\n\nIndented code\n\n    // Some comments\n    line 1 of code\n    line 2 of code\n    line 3 of code\n\n\nBlock code "fences"\n\n```\nSample text here...\n```\n\nSyntax highlighting\n\n``` js\nvar foo = function (bar) {\n  return bar++;\n};\n\nconsole.log(foo(5));\n```\n\n## Tables\n\n| Option | Description |\n| ------ | ----------- |\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\nRight aligned columns\n\n| Option | Description |\n| ------:| -----------:|\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\n\n## Links\n\n[link text](http://dev.nodeca.com)\n\n[link with title](http://nodeca.github.io/pica/demo/ "title text!")\n\nAutoconverted link https://github.com/nodeca/pica (enable linkify to see)\n\n\n## Images\n\n![Minion](https://octodex.github.com/images/minion.png)\n![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")\n\nLike links, Images also have a footnote style syntax\n\n![Alt text][id]\n\nWith a reference later in the document defining the URL location:\n\n[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"\n\n\n## Plugins\n\nThe killer feature of `markdown-it` is very effective support of\n[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).\n\n\n### [Emojies](https://github.com/markdown-it/markdown-it-emoji)\n\n> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:\n>\n> Shortcuts (emoticons): :-) :-( 8-) ;)\n\nsee [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.\n\n\n### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)\n\n- 19^th^\n- H~2~O\n\n\n### [\\<ins>](https://github.com/markdown-it/markdown-it-ins)\n\n++Inserted text++\n\n\n### [\\<mark>](https://github.com/markdown-it/markdown-it-mark)\n\n==Marked text==\n\n\n### [Footnotes](https://github.com/markdown-it/markdown-it-footnote)\n\nFootnote 1 link[^first].\n\nFootnote 2 link[^second].\n\nInline footnote^[Text of inline footnote] definition.\n\nDuplicated footnote reference[^second].\n\n[^first]: Footnote **can have markup**\n\n    and multiple paragraphs.\n\n[^second]: Footnote text.\n\n\n### [Definition lists](https://github.com/markdown-it/markdown-it-deflist)\n\nTerm 1\n\n:   Definition 1\nwith lazy continuation.\n\nTerm 2 with *inline markup*\n\n:   Definition 2\n\n        { some code, part of Definition 2 }\n\n    Third paragraph of definition 2.\n\n_Compact style:_\n\nTerm 1\n  ~ Definition 1\n\nTerm 2\n  ~ Definition 2a\n  ~ Definition 2b\n\n\n### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)\n\nThis is HTML abbreviation example.\n\nIt converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.\n\n*[HTML]: Hyper Text Markup Language\n\n### [Custom containers](https://github.com/markdown-it/markdown-it-container)\n\n::: warning\n*here be dragons*\n:::\n'
    }),

    computed: {
        rawHTML: function () {

            var md = MarkdownIt({
                html: true,
                linkify: true,
                typographer: true,
                highlight: function (str, lang) {
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            return '<pre class="hljs dark"><code class="dark">' +
                                hljs.highlight(lang, str, true).value +
                                '</code></pre>';
                        } catch (__) {
                            console.log('highligh.js error')
                        }
                    }

                    return '<pre class="hljs dark"><code class="dark">' + md.utils.escapeHtml(str) + '</code></pre>';
                }
            });
            var result = md.render(this.markdown);
            return result
        }
    },
    methods: {

    }
}
</script>

<style lang="scss">
.hljs.dark {

    // this block gets rid of bad style that vuetify puts on code blocks
    background-color: #011627;

    code.dark {
        background-color: #011627;

        color: #d6deeb;
        padding: 0;
    }

    .hljs {
        display: block;
        overflow-x: auto;
        padding: 0.5em;
        background: #011627;
        color: #d6deeb;
    }

    /* General Purpose */
    .hljs-keyword {
        color: #c792ea;
        font-style: italic;
    }

    .hljs-built_in {
        color: #addb67;
        font-style: italic;
    }

    .hljs-type {
        color: #82aaff;
    }

    .hljs-literal {
        color: #ff5874;
    }

    .hljs-number {
        color: #F78C6C;
    }

    .hljs-regexp {
        color: #5ca7e4;
    }

    .hljs-string {
        color: #ecc48d;
    }

    .hljs-subst {
        color: #d3423e;
    }

    .hljs-symbol {
        color: #82aaff;
    }

    .hljs-class {
        color: #ffcb8b;
    }

    .hljs-function {
        color: #82AAFF;
    }

    .hljs-title {
        color: #DCDCAA;
        font-style: italic;
    }

    .hljs-params {
        color: #7fdbca;
    }

    /* Meta */
    .hljs-comment {
        color: #637777;
        font-style: italic;
    }

    .hljs-doctag {
        color: #7fdbca;
    }

    .hljs-meta {
        color: #82aaff;
    }

    .hljs-meta-keyword {
        color: #82aaff;
    }

    .hljs-meta-string {
        color: #ecc48d;
    }

    /* Tags, attributes, config */
    .hljs-section {
        color: #82b1ff;
    }

    .hljs-tag,
    .hljs-name,
    .hljs-builtin-name {
        color: #7fdbca;
    }

    .hljs-attr {
        color: #7fdbca;
    }

    .hljs-attribute {
        color: #80cbc4;
    }

    .hljs-variable {
        color: #addb67;
    }

    /* Markup */
    .hljs-bullet {
        color: #d9f5dd;
    }

    .hljs-code {
        color: #80CBC4;
    }

    .hljs-emphasis {
        color: #c792ea;
        font-style: italic;
    }

    .hljs-strong {
        color: #addb67;
        font-weight: bold;
    }

    .hljs-formula {
        color: #c792ea;
    }

    .hljs-link {
        color: #ff869a;
    }

    .hljs-quote {
        color: #697098;
        font-style: italic;
    }

    /* CSS */
    .hljs-selector-tag {
        color: #ff6363;
    }

    .hljs-selector-id {
        color: #fad430;
    }

    .hljs-selector-class {
        color: #addb67;
        font-style: italic;
    }

    .hljs-selector-attr,
    .hljs-selector-pseudo {
        color: #c792ea;
        font-style: italic;
    }

    /* Templates */
    .hljs-template-tag {
        color: #c792ea;
    }

    .hljs-template-variable {
        color: #addb67;
    }

    /* diff */
    .hljs-addition {
        color: #addb67ff;
        font-style: italic;
    }

    .hljs-deletion {
        color: #EF535090;
        font-style: italic;
    }
}
</style>

<style lang="scss">
.hljs.light {

    // this block gets rid of bad style that vuetify puts on code blocks
    code.light {
        background-color: transparent;
        color: black;
        padding: 0;
    }

    .hljs {
        display: block;
        overflow-x: auto;
        padding: 0.5em;
        background: #fff;
        color: black;
    }

    /* Gray DOCTYPE selectors like WebKit */
    .xml .hljs-meta {
        color: #c0c0c0;
    }

    .hljs-comment,
    .hljs-quote {
        color: #007400;
    }

    .hljs-tag,
    .hljs-attribute,
    .hljs-keyword,
    .hljs-selector-tag,
    .hljs-literal,
    .hljs-name {
        color: #aa0d91;
    }

    .hljs-variable,
    .hljs-template-variable {
        color: #3F6E74;
    }

    .hljs-code,
    .hljs-string,
    .hljs-meta-string {
        color: #c41a16;
    }

    .hljs-regexp,
    .hljs-link {
        color: #0E0EFF;
    }

    .hljs-title,
    .hljs-symbol,
    .hljs-bullet,
    .hljs-number {
        color: #1c00cf;
    }

    .hljs-section,
    .hljs-meta {
        color: #643820;
    }

    .hljs-class .hljs-title,
    .hljs-type,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-params {
        color: #5c2699;
    }

    .hljs-attr {
        color: #836C28;
    }

    .hljs-subst {
        color: #000;
    }

    .hljs-formula {
        background-color: #eee;
        font-style: italic;
    }

    .hljs-addition {
        background-color: #baeeba;
    }

    .hljs-deletion {
        background-color: #ffc8bd;
    }

    .hljs-selector-id,
    .hljs-selector-class {
        color: #9b703f;
    }

    .hljs-doctag,
    .hljs-strong {
        font-weight: bold;
    }

    .hljs-emphasis {
        font-style: italic;
    }

}
</style>
