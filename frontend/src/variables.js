var brand = 'hackerd.io'
var tagLine = 'The integrated bookmark and notes manager for programmers'
var apiStage = process.env.VUE_APP_ENVIRONMENT === 'prod' ? 'prod' : 'dev'
var baseUrl = 'https://api.hackerd.io/' + apiStage + '/'
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
