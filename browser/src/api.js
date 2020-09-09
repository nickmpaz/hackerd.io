import axios from "axios";
import variables from './variables.js'
export default {
    getResources: function (apiToken) {
        return new Promise((resolve) => {
            if (!apiToken) {
                resolve([])
            }
            axios({
                method: "post",
                url: variables.api + 'external/resources',
                data: {
                    apiToken: apiToken
                },
            })
                .then((response) => {
                    resolve(response.data.resources)
                })
                .catch((err) => {
                    console.log(err)
                    resolve([])
                });
        })
    }
}