<template>
  <div>
    <!-- dialogs -->
    <loading-dialog :active="deleting" message="Deleting" />
    <confirm-dialog
      :active="confirmDeleteDialog"
      prompt="Delete Link?"
      confirmMessage="delete"
      declineMessage="cancel"
      @confirm="deleteResource"
      @decline="confirmDeleteDialog = false"
    />
    <!-- main content -->

    <!-- back button -->
    <div class="d-flex my-6">
      <v-btn color="secondary" width="125" @click="$utils.goBack">
        <v-icon left>mdi-arrow-left</v-icon>Back
      </v-btn>
      <v-spacer></v-spacer>
      <responsive-button-group
        v-if="mode === 'read'"
        :items="actionItems"
        :collapse="$vuetify.breakpoint.mdAndDown"
        menuText="Actions"
        menuIcon="mdi-chevron-down"
        menuWidth="125"
      />
      <v-btn color="secondary" width="125" @click="save" v-else>
        <v-icon left color="green">mdi-check</v-icon>Save
      </v-btn>
    </div>
    <!-- header card -->
    <v-card class="px-6 py-4 mb-6">
      <resource-header v-if="mode === 'read'" :resource="resource" />
      <editable-resource-header v-if="mode === 'write'" :resource="resource" />
    </v-card>
    <!-- editor card -->
    <div>
      <no-content
        v-if="(resource.content === '' ) && mode === 'read'"
        callToAction="Click here to start editing."
        @engage="mode = 'write'"
      />
      <v-card v-else class="pa-6">
        <v-text-field
          v-model="resource.content"
          class="short-text-field"
          label="URL"
          single-line
          solo
          background-color="secondary"
          :readonly="mode === 'read'"
        ></v-text-field>
        <link-prevue v-if="previewUrl" :url="previewUrl" cardWidth="100%" class="mt-3">
          <template slot-scope="props">
            <v-card color="secondary" height="300">
              <v-row class="fill-height" align="center">
                <v-col cols="12" sm="8" class="fill-height">
                  <div class="d-flex flex-column fill-height px-6 pb-2">
                    <h1>{{ props.title || previewUrl }}</h1>
                    <hr class="my-2" />
                    <p class="card-text">{{props.description || previewUrl }}</p>
                    <v-spacer></v-spacer>
                    <v-btn
                      width="125"
                      color="primary"
                      @click="$utils.openInNewTab(props.url)"
                    >See More</v-btn>
                  </div>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-img
                    :src="props.img || $utils.assets('./image-placeholder.svg')"
                    :alt="props.title"
                    height="250"
                    contain
                  />
                </v-col>
              </v-row>
            </v-card>
          </template>
          <template slot="loading">
            <v-card color="secondary" height="300">
              <div class="fill-height d-flex align-center justify-center">
                <v-progress-circular indeterminate></v-progress-circular>
              </div>
            </v-card>
          </template>
        </link-prevue>
      </v-card>
    </div>
  </div>
</template>

<script>
import LinkPrevue from "link-prevue";

import LoadingDialog from "../components/LoadingDialog";
import EditableResourceHeader from "../components/EditableResourceHeader";
import ResourceHeader from "../components/ResourceHeader";
import ConfirmDialog from "../components/ConfirmDialog";
import NoContent from "@/components/NoContent";
import ResponsiveButtonGroup from "@/components/ResponsiveButtonGroup";

export default {
  components: {
    ConfirmDialog,
    LoadingDialog,
    EditableResourceHeader,
    ResourceHeader,
    NoContent,
    ResponsiveButtonGroup,
    LinkPrevue,
  },
  props: ["resource", "editMode"],
  data() {
    var vm = this;
    return {
      mode: "read",
      fab: false,
      confirmDeleteDialog: false,
      deleting: false,
      previewUrl: null,
      actionItems: [
        {
          text: "Edit",
          icon: "mdi-pencil",
          buttonColor: "none",
          buttonWidth: "125",
          iconColor: "green",
          function: function () {
            vm.edit();
          },
        },
        {
          text: "Export",
          icon: "mdi-export",
          buttonColor: "none",
          buttonWidth: "125",
          iconColor: "blue",
          function: function () {
            vm.exportResource();
          },
        },
        {
          text: "Delete",
          icon: "mdi-delete",
          buttonColor: "none",
          buttonWidth: "125",
          iconColor: "red",
          function: function () {
            vm.confirmDeleteDialog = true;
          },
        },
      ],
    };
  },

  created() {
    var vm = this;
    if (vm.editMode) vm.mode = "write";
    vm.previewUrl = vm.resource.content;
  },
  methods: {
    edit: function () {
      var vm = this;
      vm.mode = "write";
    },
    save: async function () {
      var vm = this;
      vm.mode = "read";
      vm.previewUrl = vm.resource.content;
      await vm.$api.updateResource(
        vm.$route.params.stashId,
        vm.$route.params.resourceId,
        vm.resource.name,
        vm.resource.tags,
        vm.resource.content
      );
    },
    deleteResource: async function () {
      var vm = this;
      vm.confirmDeleteDialog = false;
      vm.deleting = true;
      await vm.$api.deleteResource(
        vm.$route.params.stashId,
        vm.$route.params.resourceId
      );
      vm.deleting = false;
      vm.$utils.goBack();
    },
    exportResource: function () {
      var vm = this;
      vm.$utils.downloadObj(vm.resource, vm.resource.name);
    },
  },
};
</script>

<style lang="scss">
</style>