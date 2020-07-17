var baseUrl = 'https://ivwbrs4jr6.execute-api.us-east-1.amazonaws.com/dev/';
module.exports = {
  brand: 'ApplicationName',
  stageIndicator: process.env.VUE_APP_STAGE_INDICATOR,
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
};
