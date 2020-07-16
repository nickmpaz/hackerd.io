var baseUrl = 'https://ivwbrs4jr6.execute-api.us-east-1.amazonaws.com/dev/'
var variables = {
  brand: 'Application',
  navBarTitle: process.env.VUE_APP_NAV_BAR_TITLE,
  api: {
    baseUrl: baseUrl,
    ping: baseUrl + 'ping',
    pingAuth: baseUrl + 'ping_auth',
    createNote: baseUrl + 'notes',
    getNotes: baseUrl + 'notes',
    getNote: baseUrl + 'notes/',
    updateNote: baseUrl + 'notes/'
  },
  darkModeDefault: true
}

export default variables