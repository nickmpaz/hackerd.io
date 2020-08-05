<template>
  <v-container fluid>
    <loading-dialog :active="deleting" message="Deleting" />
    <loading-dialog :active="saving" message="Saving" />
    <confirm-dialog
      :active="confirmDeleteDialog"
      prompt="Delete Note?"
      confirmMessage="delete"
      declineMessage="cancel"
      @confirm="deleteResource"
      @decline="confirmDeleteDialog = false"
    />
    <!-- floating action buttons -->
    <v-btn fab dark fixed bottom right large color="success" @click="saveResource" class="ma-6">
      <v-icon large>mdi-check</v-icon>
    </v-btn>
    <!-- main content -->
    <v-row justify="center">
      <v-col cols="12" md="10" xl="8">
        <editable-resource-header :resource="resource" />
        <v-text-field v-model="resource.content" label="Url" single-line solo></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { Auth } from "aws-amplify";
import LoadingDialog from "../components/LoadingDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import EditableResourceHeader from "../components/EditableResourceHeader";

export default {
  components: {
    LoadingDialog,
    ConfirmDialog,
    EditableResourceHeader,
  },
  props: ["resource"],
  data: () => ({
    confirmDeleteDialog: false,
    deleting: false,
    saving: false,
    tagInput: "",
  }),
  computed: {},
  beforeCreate() {},
  async created() {},
  methods: {
    addTag: function () {
      var vm = this;
      if (!vm.note.tags.includes(vm.tagInput)) {
        vm.note.tags.push(vm.tagInput.toLowerCase());
        vm.note.tags.sort();
      }
      vm.tagInput = "";
    },
    removeTag: function (tag) {
      var vm = this;
      vm.note.tags = vm.note.tags.filter((e) => e !== tag);
      document.activeElement.blur(); // stop next tag from getting button focus after you remove a tag
    },
    saveResource: async function () {
      var vm = this;
      vm.saving = true
      console.log('here')
      console.log(vm.resource)
      Auth.currentAuthenticatedUser()
        .then((data) => {
          axios({
            method: vm.$variables.api.updateResource.method,
            url:
              vm.$variables.api.updateResource.url + vm.$route.params.resource_id,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken,
            },
            data: {
              resource: vm.resource,
            },
          })
            .then((response) => {
              vm.saving = false
              console.log(response);
              vm.$router.push({
                name: "Index",
              });
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteResource: function () {},
  },
};
</script>

<style lang="scss">
</style>
