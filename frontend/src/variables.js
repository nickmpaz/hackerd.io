var brand = 'hackerd.io'
var tagLine = 'Bookmark and notes manager for programmers'
var baseUrl = 'https://api.hackerd.io/' + process.env.VUE_APP_ENVIRONMENT + '/'
var stageIndicator =
  process.env.VUE_APP_ENVIRONMENT === 'prod'
    ? ''
    : ' (' + process.env.VUE_APP_ENVIRONMENT + ')'

var api = {
  baseUrl: baseUrl,
  ping: {
    url: baseUrl + 'ping',
    method: 'GET'
  },
  pingAuth: {
    url: baseUrl + 'ping_auth',
    method: 'GET'
  },
  createNote: {
    url: baseUrl + 'resources',
    method: 'POST'
  },
  getNotes: {
    url: baseUrl + 'resources',
    method: 'GET'
  },
  getNote: {
    url: baseUrl + 'resources/',
    method: 'GET'
  },
  updateNote: {
    url: baseUrl + 'resources/',
    method: 'POST'
  },
}

module.exports = {
  brand: brand,
  tagLine: tagLine,
  stageIndicator: stageIndicator,
  api: api,
  darkModeDefault: true
}
