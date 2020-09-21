<template>
  <v-card :width="width" class="py-2" style="overflow: auto;">
    <loading-dialog :active="creatingDialog" message="Creating" />
    <loading-dialog :active="deletingDialog" message="Deleting" />
    <single-prompt-dialog
      :active="createNamespacePromptDialog"
      prompt="Create Namespace"
      promptLabel="Name"
      confirmMessage="Create"
      declineMessage="Cancel"
      @confirm="createNamespace"
      @decline="createNamespacePromptDialog = false"
    />
    <confirm-dialog
      :active="confirmDeleteDialog"
      prompt="Delete this namespace and all resources that belong to it?"
      confirmMessage="Delete"
      declineMessage="Cancel"
      @decline="confirmDeleteDialog = false"
      @confirm="deleteNamespace"
    />
    <div class="d-flex justify-end py-1">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            x-small
            color="transparent"
            depressed
            v-bind="attrs"
            v-on="on"
            @click="confirmDeleteDialog = true"
          >
            <v-icon class>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Delete Folder</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            x-small
            color="transparent"
            depressed
            v-bind="attrs"
            v-on="on"
            @click="createNamespacePromptDialog = true"
          >
            <v-icon>mdi-folder</v-icon>
          </v-btn>
        </template>
        <span>Create Folder</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn x-small color="transparent" depressed v-bind="attrs" v-on="on">
            <v-icon class="py-4">mdi-minus</v-icon>
          </v-btn>
        </template>
        <span>Collapse Folders</span>
      </v-tooltip>
    </div>
    <hr class="my-2" />
    <div>
      <v-treeview
        hoverable
        activatable
        :active.sync="activeDummyNamespace"
        :items="dummyNamespaceTree"
        expand-icon="mdi-chevron-down"
        open-all
      ></v-treeview>
      <hr class="my-2" />
      <v-treeview
        hoverable
        activatable
        :active.sync="activeNamespace"
        :items="namespaceTree"
        item-key="sk"
        expand-icon="mdi-chevron-down"
        open-all
      ></v-treeview>
    </div>
  </v-card>
</template>

<script>
import LoadingDialog from "@/components/LoadingDialog";
import SinglePromptDialog from "@/components/SinglePromptDialog";
import ConfirmDialog from "@/components/ConfirmDialog";

export default {
  props: {
    width: Number,
  },
  components: {
    LoadingDialog,
    SinglePromptDialog,
    ConfirmDialog,
  },
  data() {
    return {
      creatingDialog: false,
      createNamespacePromptDialog: false,
      confirmDeleteDialog: false,
      deletingDialog: false,
    };
  },
  computed: {
    namespaceTree: function () {
      return this.$store.getters.namespaceTree;
    },
    dummyNamespaceTree: function () {
      return this.$store.getters.dummyNamespaceTree;
    },
    stashId: function () {
      return this.$store.getters.stashId;
    },
    activeNamespace: {
      get: function () {
        return this.$store.getters.activeNamespace;
      },
      set: function (newValue) {
        this.$store.commit("activeNamespace", newValue);
        if (newValue.length > 0) {
          this.$store.commit("activeDummyNamespace", []);
        }
      },
    },
    activeDummyNamespace: {
      get: function () {
        return this.$store.getters.activeDummyNamespace;
      },
      set: function (newValue) {
        this.$store.commit("activeDummyNamespace", newValue);
        if (newValue.length > 0) {
          this.$store.commit("activeNamespace", []);
        }
      },
    },
  },
  created() {
    this.$store.commit("namespace", "0");
  },

  methods: {
    createNamespace: async function (name) {
      var vm = this;
      vm.createNamespacePromptDialog = false;
      vm.creatingDialog = true;
      var namespace = await vm.$api.createNamespace(
        vm.stashId,
        name,
        vm.$store.getters.namespace.sk
      );
      var namespaces = await vm.$api.indexNamespaces(vm.stashId);
      vm.creatingDialog = false;
      vm.$store.commit("namespaces", namespaces);
      vm.$store.commit("namespace", namespace.sk);
    },
    deleteNamespace: async function () {
      var vm = this;
      vm.confirmDeleteDialog = false;
      vm.deletingDialog = true;
      console.log(vm.stashId, vm.$store.getters.namespace.sk);
      var namespaceToDelete = vm.$store.getters.namespace;
      await vm.$api.deleteNamespace(vm.stashId, namespaceToDelete.sk);
      var namespaces = await vm.$api.indexNamespaces(vm.stashId);
      vm.$store.commit("namespaces", namespaces);
      vm.$store.commit("namespace", namespaceToDelete.parent);
      vm.deletingDialog = false;
    },
  },
};
</script>

<style>
</style>