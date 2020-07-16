import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import Amplify from 'aws-amplify'
import '@aws-amplify/ui-vue'
import aws_exports from './aws-exports'

import prism from 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/toolbar/prism-toolbar.js'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.js'


import MarkdownIt from 'markdown-it'

Vue.config.productionTip = false
Amplify.configure(aws_exports)

var settings = require('./settings')
Vue.prototype.$settings = settings
Vue.prototype.$api = {
  ping: settings.baseUrl + 'ping',
  pingAuth: settings.baseUrl + 'ping_auth',
  createNote: settings.baseUrl + 'notes',
  getNotes: settings.baseUrl + 'notes',
  getNote: settings.baseUrl + 'notes/',
  updateNote: settings.baseUrl + 'notes/'
}

var lang_dependencies = /*dependencies_placeholder[*/ {
  javascript: 'clike',
  actionscript: 'javascript',
  arduino: 'cpp',
  aspnet: ['markup', 'csharp'],
  bison: 'c',
  c: 'clike',
  csharp: 'clike',
  cpp: 'c',
  coffeescript: 'javascript',
  crystal: 'ruby',
  'css-extras': 'css',
  d: 'clike',
  dart: 'clike',
  django: 'markup-templating',
  ejs: ['javascript', 'markup-templating'],
  etlua: ['lua', 'markup-templating'],
  erb: ['ruby', 'markup-templating'],
  fsharp: 'clike',
  'firestore-security-rules': 'clike',
  flow: 'javascript',
  ftl: 'markup-templating',
  glsl: 'clike',
  gml: 'clike',
  go: 'clike',
  groovy: 'clike',
  haml: 'ruby',
  handlebars: 'markup-templating',
  haxe: 'clike',
  java: 'clike',
  javadoc: ['markup', 'java', 'javadoclike'],
  jolie: 'clike',
  jsdoc: ['javascript', 'javadoclike'],
  'js-extras': 'javascript',
  'js-templates': 'javascript',
  jsonp: 'json',
  json5: 'json',
  kotlin: 'clike',
  latte: ['clike', 'markup-templating', 'php'],
  less: 'css',
  lilypond: 'scheme',
  markdown: 'markup',
  'markup-templating': 'markup',
  n4js: 'javascript',
  nginx: 'clike',
  objectivec: 'c',
  opencl: 'c',
  parser: 'markup',
  php: ['clike', 'markup-templating'],
  phpdoc: ['php', 'javadoclike'],
  'php-extras': 'php',
  plsql: 'sql',
  processing: 'clike',
  protobuf: 'clike',
  pug: ['markup', 'javascript'],
  qml: 'javascript',
  qore: 'clike',
  jsx: ['markup', 'javascript'],
  tsx: ['jsx', 'typescript'],
  reason: 'clike',
  ruby: 'clike',
  sass: 'css',
  scss: 'css',
  scala: 'java',
  'shell-session': 'bash',
  smarty: 'markup-templating',
  solidity: 'clike',
  soy: 'markup-templating',
  sparql: 'turtle',
  sqf: 'clike',
  swift: 'clike',
  tap: 'yaml',
  textile: 'markup',
  tt2: ['clike', 'markup-templating'],
  twig: 'markup',
  typescript: 'javascript',
  't4-cs': ['t4-templating', 'csharp'],
  't4-vb': ['t4-templating', 'visual-basic'],
  vala: 'clike',
  vbnet: 'basic',
  velocity: 'markup',
  wiki: 'markup',
  xeora: 'markup',
  xquery: 'markup'
} /*]*/

var lang_aliases = /*aliases_placeholder[*/ {
  html: 'markup',
  xml: 'markup',
  svg: 'markup',
  mathml: 'markup',
  js: 'javascript',
  g4: 'antlr4',
  adoc: 'asciidoc',
  shell: 'bash',
  shortcode: 'bbcode',
  rbnf: 'bnf',
  conc: 'concurnas',
  cs: 'csharp',
  dotnet: 'csharp',
  coffee: 'coffeescript',
  jinja2: 'django',
  'dns-zone': 'dns-zone-file',
  dockerfile: 'docker',
  xlsx: 'excel-formula',
  xls: 'excel-formula',
  gamemakerlanguage: 'gml',
  hs: 'haskell',
  tex: 'latex',
  context: 'latex',
  ly: 'lilypond',
  emacs: 'lisp',
  elisp: 'lisp',
  'emacs-lisp': 'lisp',
  md: 'markdown',
  moon: 'moonscript',
  n4jsd: 'n4js',
  objectpascal: 'pascal',
  px: 'pcaxis',
  pq: 'powerquery',
  mscript: 'powerquery',
  py: 'python',
  robot: 'robotframework',
  rb: 'ruby',
  sln: 'solution-file',
  rq: 'sparql',
  trig: 'turtle',
  ts: 'typescript',
  t4: 't4-cs',
  vb: 'visual-basic',
  xeoracube: 'xeora',
  yml: 'yaml'
} /*]*/

function loadPrismDependencies (lang) {
  if (lang in lang_dependencies) {
    if (Array.isArray(lang_dependencies[lang])) {
      var dependency
      for (dependency of lang_dependencies[lang]) {
        loadPrismDependencies(dependency)
      }
    } else {
      loadPrismDependencies(lang_dependencies[lang])
    }
  }
  try {
    require('prismjs/components/prism-' + lang)
    return true
  } catch {
    return false
  }
}

Vue.prototype.$md = MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang in lang_aliases) lang = lang_aliases[lang]
    if (lang in prism.languages || loadPrismDependencies(lang)) {
      return prism.highlight(str, prism.languages[lang], lang)
    } else {
      return ''
    }
  }
})

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
