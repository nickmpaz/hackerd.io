import axios from "axios";
import { Auth } from "aws-amplify";

var baseUrl = 'https://api.stashable.io/' + process.env.VUE_APP_ENVIRONMENT + '/'

export default {
    createResource: function (payload) {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser()
                .then((data) => {
                    axios({
                        method: 'POST',
                        url: baseUrl + 'resources',
                        headers: {
                            Authorization: data.signInUserSession.idToken.jwtToken,
                        },
                        data: payload,
                    })
                        .then((response) => {
                            var resource = response.data.resource;
                            resolve(resource)
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
    }
}