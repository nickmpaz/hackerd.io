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
        <div class="d-flex my-6">
          <v-btn color="secondary darken-1" width="125" @click="$router.push({name: 'Index'})">
            <div class="d-flex justify-space-between align-center">
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              <span class="mr-2">Back</span>
            </div>
          </v-btn>
        </div>
        <v-card class="px-6 pt-6 pb-4">
          <editable-resource-header :resource="resource" />
          <v-text-field
            v-model="resource.content"
            label="Url"
            single-line
            solo
            background-color="secondary darken-1"
            class="short-text-field"
          ></v-text-field>
        </v-card>
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
  mounted() {
    var vm = this;
    this._keyListener = function (e) {
      console.log(e);
      if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        vm.saveResource();
      } else if (e.key === "h" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        vm.$router.push({ name: "Index" });
      }
    };
    document.addEventListener("keydown", this._keyListener);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this._keyListener);
  },
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
      vm.saving = true;
      console.log("here");
      console.log(vm.resource);
      Auth.currentAuthenticatedUser()
        .then((data) => {
          axios({
            method: vm.$variables.api.updateResource.method,
            url:
              vm.$variables.api.updateResource.url +
              vm.$route.params.resource_id,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken,
            },
            data: {
              resource: vm.resource,
            },
          })
            .then((response) => {
              vm.saving = false;
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
