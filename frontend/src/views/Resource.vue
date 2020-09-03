<template>
  <v-container fluid>
    <loading-dialog :active="loading" message="Loading" />
    <v-row justify="center">
      <v-col cols="12" md="10" xl="8">
        <div v-if="!loading">
          <h1 class="source-code-pro">Resources</h1>
          <note-resource v-if="resource.type === 'note'" :resource="resource" :editMode="edit" />
          <link-resource v-if="resource.type === 'link'" :resource="resource" />
          <snippet-resource
            v-if="resource.type === 'snippet'"
            :resource="resource"
            :editMode="edit"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { Auth } from "aws-amplify";

import LoadingDialog from "../components/LoadingDialog";
import LinkResource from "../components/LinkResource";
import NoteResource from "../components/NoteResource";
import SnippetResource from "../components/SnippetResource";

export default {
  components: {
    LoadingDialog,
    LinkResource,
    NoteResource,
    SnippetResource,
  },
  data: () => ({
    loading: true,
    resource: null,
    edit: false,
  }),
  async created() {
    var vm = this;
    vm.edit = vm.$route.params.edit;
    if (vm.$route.params.resource) {
      vm.resource = vm.$route.params.resource;
      vm.loading = false;
      console.log(vm.resource);
    } else {
      Auth.currentAuthenticatedUser()
        .then((data) => {
          axios({
            method: vm.$variables.api.getResource.method,
            url:
              vm.$variables.api.getResource.url + vm.$route.params.resource_id,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken,
            },
          })
            .then(async function (response) {
              vm.resource = response.data.resource;
              vm.loading = false;
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
</script>
