import axios from "axios";
import { Auth } from "aws-amplify";

var baseUrl = 'https://api.stashable.io/' + process.env.VUE_APP_ENVIRONMENT + '/'

export default {
    createStash: function (name) {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser()
                .then((data) => {
                    axios({
                        method: 'POST',
                        url: baseUrl + 'stashes',
                        headers: {
                            Authorization: data.signInUserSession.idToken.jwtToken,
                        },
                        data: {
                            name: name
                        },
                    })
                        .then((response) => {
                            var stash = response.data.stash;
                            resolve(stash)
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err)
                        });
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                });
        });
    },
    getStashes: function () {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser()
                .then((data) => {
                    axios({
                        method: 'GET',
                        url: baseUrl + 'stashes',
                        headers: {
                            Authorization: data.signInUserSession.idToken.jwtToken,
                        },
                    })
                        .then((response) => {
                            var stashes = response.data.stashes;
                            resolve(stashes)
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err)
                        });
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                });
        });
    },
    deleteStash: function (stashId) {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser()
                .then((data) => {
                    axios({
                        method: 'DELETE',
                        url: baseUrl + `stashes/${stashId}`,
                        headers: {
                            Authorization: data.signInUserSession.idToken.jwtToken,
                        },
                    })
                        .then((response) => {
                            console.log(response)
                            resolve()
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err)
                        });
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                });
        });
    },
    getStash: function (stashId) {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser()
                .then((data) => {
                    axios({
                        method: 'GET',
                        url: baseUrl + `stashes/${stashId}`,
                        headers: {
                            Authorization: data.signInUserSession.idToken.jwtToken,
                        },
                    })
                        .then((response) => {
                            resolve(response.data)
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err)
                        });
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                });
        });
    },
    createNamespace: function (stashId, name, parent) {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser()
                .then((data) => {
                    axios({
                        method: 'POST',
                        url: baseUrl + `stashes/${stashId}/namespaces`,
                        headers: {
                            Authorization: data.signInUserSession.idToken.jwtToken,
                        },
                        data: {
                            name: name,
                            parent: parent
                        },
                    })
                        .then((response) => {
                            resolve(response.data.namespace)
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err)
                        });
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                });
        });
    },
    indexNamespaces: function (stashId) {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser()
                .then((data) => {
                    axios({
                        method: 'GET',
                        url: baseUrl + `stashes/${stashId}/namespaces`,
                        headers: {
                            Authorization: data.signInUserSession.idToken.jwtToken,
                        },
                    })
                        .then((response) => {
                            resolve(response.data.namespaces)
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err)
                        });
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                });
        });
    },
    deleteNamespace: function (stashId, namespaceId) {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser()
                .then((data) => {
                    axios({
                        method: 'DELETE',
                        url: baseUrl + `stashes/${stashId}/namespaces/${namespaceId}`,
                        headers: {
                            Authorization: data.signInUserSession.idToken.jwtToken,
                        },
                    })
                        .then((response) => {
                            resolve(response)
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err)
                        });
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                });
        });
    },
    indexResources: function (stashId) {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser()
                .then((data) => {
                    axios({
                        method: 'GET',
                        url: baseUrl + `stashes/${stashId}/resources`,
                        headers: {
                            Authorization: data.signInUserSession.idToken.jwtToken,
                        },
                    })
                        .then((response) => {
                            resolve(response.data.resources)
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err)
                        });
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                });
        });
    },
    createResource: function (stashId, type, namespace) {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser()
                .then((data) => {
                    axios({
                        method: 'POST',
                        url: baseUrl + `stashes/${stashId}/resources`,
                        headers: {
                            Authorization: data.signInUserSession.idToken.jwtToken,
                        },
                        data: {
                            type: type,
                            namespace: namespace,
                        },
                    })
                        .then((response) => {
                            resolve(response.data.resource)
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err)
                        });
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                });
        });
    },
    getResource: function (stashId, resourceId) {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser()
                .then((data) => {
                    axios({
                        method: 'GET',
                        url: baseUrl + `stashes/${stashId}/resources/${resourceId}`,
                        headers: {
                            Authorization: data.signInUserSession.idToken.jwtToken,
                        },
                    })
                        .then((response) => {
                            resolve(response.data.resource)
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err)
                        });
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                });
        });
    },
    deleteResource: function (stashId, resourceId) {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser()
                .then((data) => {
                    axios({
                        method: 'DELETE',
                        url: baseUrl + `stashes/${stashId}/resources/${resourceId}`,
                        headers: {
                            Authorization: data.signInUserSession.idToken.jwtToken,
                        },
                    })
                        .then((response) => {
                            resolve(response)
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err)
                        });
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                });
        });
    },
    updateResource: function (stashId, resourceId, name, tags, content, language = null) {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser()
                .then((data) => {
                    axios({
                        method: 'POST',
                        url: baseUrl + `stashes/${stashId}/resources/${resourceId}`,
                        headers: {
                            Authorization: data.signInUserSession.idToken.jwtToken,
                        },
                        data: {
                            name,
                            tags,
                            content,
                            language
                        }
                    })
                        .then((response) => {
                            resolve(response)
                        })
                        .catch((err) => {
                            console.error(err);
                            reject(err)
                        });
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                });
        });
    },
}