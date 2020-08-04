var brand = 'hackerd.io'
var tagLine = 'Bookmark and notes manager for programmers'
var baseUrl = 'https://api.hackerd.io/' + process.env.VUE_APP_ENVIRONMENT + '/'
var stageIndicator =
  process.env.VUE_APP_ENVIRONMENT === 'prod'
    ? ''
    : ' (' + process.env.VUE_APP_ENVIRONMENT + ')'
var api = {
  baseUrl: baseUrl,
  ping: baseUrl + 'ping',
  pingAuth: baseUrl + 'ping_auth',
  createNote: baseUrl + 'notes',
  getNotes: baseUrl + 'notes',
  getNote: baseUrl + 'notes/',
  updateNote: baseUrl + 'notes/'
}

module.exports = {
  brand: brand,
  tagLine: tagLine,
  stageIndicator: stageIndicator,
  api: api,
  darkModeDefault: true
}
