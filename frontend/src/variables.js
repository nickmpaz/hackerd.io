var brand = 'Stashable.io'
var tagLine = 'Integrated knowledge base manager for programmers'
var baseUrl = 'https://api.stashable.io/' + process.env.VUE_APP_ENVIRONMENT + '/'
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
  // resource endpoints
  createResource: {
    url: baseUrl + 'resources',
    method: 'POST'
  },
  getResources: {
    url: baseUrl + 'resources',
    method: 'GET'
  },
  getResource: {
    url: baseUrl + 'resources/',
    method: 'GET'
  },
  updateResource: {
    url: baseUrl + 'resources/',
    method: 'POST'
  },
  deleteResource: {
    url: baseUrl + 'resources/',
    method: 'DELETE'
  },
  // namespace endpoints
  createNamespace: {
    url: baseUrl + 'namespaces',
    method: 'POST'
  },
  getNamespaces: {
    url: baseUrl + 'namespaces',
    method: 'GET'
  },
  deleteNamespace: {
    url: baseUrl + 'namespaces/',
    method: 'DELETE'
  },
  getApiToken: {
    url: baseUrl + 'api_token',
    method: 'GET'
  },
  generateApiToken: {
    url: baseUrl + 'api_token',
    method: 'POST'
  },
}

module.exports = {
  brand: brand,
  tagLine: tagLine,
  stageIndicator: stageIndicator,
  api: api,
  darkModeDefault: true,
  chromeExtensionUrl: "https://chrome.google.com/webstore/detail/stashableio/lnfgdekmfoghbhpabiecoloehfdafoim"
}
