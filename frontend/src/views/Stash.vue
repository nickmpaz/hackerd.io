<template>
  <div class="fill-height">
    <loading-dialog :active="loadingDialog" message="Loading" />
    <loading-dialog :active="creatingDialog" message="Creating" />
    <create-resource-prompt-dialog
      :active="createResourcePromptDialog"
      confirmMessage="Create"
      declineMessage="Cancel"
      @decline="createResourcePromptDialog = false"
      @confirm="createResource"
    />
    <confirm-dialog
      :active="deleteResourceDialog"
      prompt="Delete Resource?"
      confirmMessage="delete"
      declineMessage="cancel"
      @decline="deleteResourceDialog = false"
      @confirm="deleteResource(resourceToDelete)"
    />
    <div v-if="!loadingDialog" class="fill-height">
      <div class="d-flex flex-column fill-height">
        <h1 class="source-code-pro mb-6">{{ data.stash.name }}</h1>
        <div class="d-flex mb-4">
          <v-btn width="125" @click="$utils.goBack">
            <v-icon left>mdi-arrow-left</v-icon>Back
          </v-btn>
          <v-spacer></v-spacer>
          <responsive-button-group
            :items="actionItems"
            :collapse="$vuetify.breakpoint.mdAndDown"
            menuText="Actions"
            menuIcon="mdi-chevron-down"
            menuWidth="125"
          />
        </div>
        <namespace-breadcrumbs class="mb-4" />
        <v-text-field
          :label="'Search ' + namespace.name"
          solo
          autofocus
          single-line
          v-model="query"
          class="short-text-field mb-3"
        ></v-text-field>
        <no-content
          v-if="searchResults.length == 0"
          callToAction="Click here to create a resource."
          @engage="createResourcePromptDialog = true"
          class="flex-grow-1"
        />
        <search-results
          v-else
          :searchResults="searchResults"
          class="flex-grow-1"
          @viewResource="viewResource"
          @deleteResource="initiateDeleteResource"
          @editResource="editResource"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LoadingDialog from "@/components/LoadingDialog";
import ResponsiveButtonGroup from "@/components/ResponsiveButtonGroup";
import CreateResourcePromptDialog from "@/components/CreateResourcePromptDialog";
import SearchResults from "@/components/SearchResults";
import NamespaceBreadcrumbs from "@/components/NamespaceBreadcrumbs";
import ConfirmDialog from "@/components/ConfirmDialog";
import NoContent from "@/components/NoContent";

export default {
  props: [],
  components: {
    LoadingDialog,
    ResponsiveButtonGroup,
    CreateResourcePromptDialog,
    SearchResults,
    NamespaceBreadcrumbs,
    ConfirmDialog,
    NoContent,
  },
  data() {
    var vm = this;
    return {
      data: null,
      resources: [],
      loadingDialog: true,
      creatingDialog: false,
      createResourcePromptDialog: false,
      resourceToDelete: null,
      deleteResourceDialog: false,
      query: "",
      actionItems: [
        {
          text: "Create",
          icon: "mdi-plus",
          buttonColor: "none",
          buttonWidth: "125",
          iconColor: "green",
          function: function () {
            vm.createResourcePromptDialog = true;
          },
        },
        {
          text: "Import",
          icon: "mdi-import",
          buttonColor: "none",
          buttonWidth: "125",
          iconColor: "blue",
          function: function () {
            vm.importResource();
          },
        },
      ],
    };
  },
  computed: {
    namespace: {
      get: function () {
        return this.$store.getters.namespace;
      },
      set: function (newValue) {
        this.$store.commit("namespace", newValue);
      },
    },
    searchResults: function () {
      var vm = this;
      var resourcesInNamespace = vm.resources.filter((e) => {
        if (vm.namespace.sk == null && vm.namespace.id == 0) {
          return (
            e.namespace == null || e.namespace in vm.$store.getters.namespaceMap
          );
        } else if (vm.namespace.sk == null && vm.namespace.id == 1) {
          return !e.name || !e.tags;
        } else if (vm.namespace.sk == null && vm.namespace.id == 2) {
          return true;
        } else {
          return vm.namespace.namespaceFilterSet.has(e.namespace);
        }
      });

      var filteredResources = vm.$utils.fuzzySearch(
        resourcesInNamespace,
        vm.query
      );
      return filteredResources;
    },
  },
  async created() {
    var vm = this;
    vm.data = await vm.$api.getStash(vm.$route.params.stashId);
    var namespaces = await vm.$api.indexNamespaces(vm.$route.params.stashId);
    vm.$store.commit("namespaces", namespaces);
    vm.$store.commit("stashId", vm.$route.params.stashId);
    vm.resources = await vm.$api.indexResources(vm.$route.params.stashId);
    vm.loadingDialog = false;
  },
  methods: {
    createResource: async function (type) {
      var vm = this;
      vm.createResourcePromptDialog = false;

      vm.creatingDialog = true;
      var resource = await vm.$api.createResource(
        vm.$route.params.stashId,
        type,
        vm.namespace.sk
      );
      vm.creatingDialog = false;
      this.editResource(resource);
    },
    viewResource: function (resource) {
      var vm = this;
      vm.$router.push({
        name: "Resource",
        params: {
          stashId: vm.$route.params.stashId,
          resourceId: resource.sk,
        },
      });
    },
    editResource: function (resource) {
      var vm = this;
      vm.$router.push({
        name: "Resource",
        params: {
          stashId: vm.$route.params.stashId,
          resourceId: resource.sk,
          edit: true,
        },
      });
    },
    initiateDeleteResource: function (resource) {
      var vm = this;
      vm.resourceToDelete = resource;
      vm.deleteResourceDialog = true;
    },
    deleteResource: async function (resource) {
      console.log("deleteing", resource);
      var vm = this;
      await vm.$api.deleteResource(vm.$route.params.stashId, resource.sk);
      vm.resources = vm.resources.filter((e) => e.sk !== resource.sk);
      vm.deleteResourceDialog = false;
    },
    importResource: async function () {},
  },
};
</script>

<style>
</style>