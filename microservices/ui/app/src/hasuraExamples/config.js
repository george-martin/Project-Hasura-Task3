var projectConfig = {
  url: {
    data: "https://data.biodegrade88.hasura-app.io/v1/query",
    auth: "https://auth.biodegrade88.hasura-app.io/v1",
    filestore: "https://filestore.biodegrade88.hasura-app.io/v1/file"
  }
}

const saveOffline = (authToken) => {
  window.localStorage.setItem('authToken', authToken);
}

const getSavedToken = () => {
  return window.localStorage.getItem('authToken');
}

module.exports = {
  projectConfig,
  saveOffline,
  getSavedToken
};
