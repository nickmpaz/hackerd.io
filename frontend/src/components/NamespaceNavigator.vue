<template>
  <div>
    <loading-dialog :active="creating" message="Creating" />
    <loading-dialog :active="deleting" message="Deleting" />
    <single-prompt-dialog
      :active="createNamespaceDialog"
      prompt="Create Namespace"
      promptLabel="Name"
      confirmMessage="Create"
      declineMessage="Cancel"
      @confirm="createNamespace"
      @decline="createNamespaceDialog = false"
    />
    <confirm-dialog
      :active="confirmDeleteDialog"
      prompt="Delete this namespace and all resources that belong to it?"
      confirmMessage="delete"
      declineMessage="cancel"
      @confirm="deleteNamespace"
      @decline="confirmDeleteDialog = false"
    />
    <div class="d-flex justify-end py-1">
      <v-btn
        @click="(activeNamespaces.length > 0) && (confirmDeleteDialog = true)"
        x-small
        color="transparent"
        depressed
      >
        <v-icon class>mdi-delete</v-icon>
      </v-btn>
      <v-btn @click="createNamespaceDialog = true" x-small color="transparent" depressed>
        <v-icon>mdi-folder</v-icon>
      </v-btn>
      <v-btn @click="openItems = []" x-small color="transparent" depressed>
        <v-icon class="py-4">mdi-minus</v-icon>
      </v-btn>
    </div>
    <hr class="my-2" />
    <v-treeview
      dense
      hoverable
      activatable
      :active.sync="activeNamespaces"
      :items="namespaceTree"
      item-key="namespace_id"
      :open="openItems"
      expand-icon="mdi-chevron-down"
      return-object
    ></v-treeview>
  </div>
</template>

<script>
import axios from "axios";
import { Auth } from "aws-amplify";
import SinglePromptDialog from "../components/SinglePromptDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import LoadingDialog from "../components/LoadingDialog";

export default {
  components: {
    SinglePromptDialog,
    ConfirmDialog,
    LoadingDialog,
  },
  data: () => ({
    createNamespaceDialog: false,
    openItems: [],
    activeNamespaces: [],
    namespaceTree: [],
    fullNamespaceSet: null,
    confirmDeleteDialog: false,
    creating: false,
    deleting: false,
  }),
  beforeCreate() {
    var vm = this;
    Auth.currentAuthenticatedUser()
      .then((data) => {
        axios({
          method: vm.$variables.api.getNamespaces.method,
          url: vm.$variables.api.getNamespaces.url,
          headers: {
            Authorization: data.signInUserSession.idToken.jwtToken,
          },
        })
          .then((response) => {
            vm.namespaces = response.data.namespaces;
            vm.namespaceTree = vm.buildNamespaceTree(vm.namespaces);
            vm.updateNamespaceSet();
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  watch: {
    activeNamespaces: function () {
      var vm = this;
      vm.updateNamespaceSet();
      vm.$emit(
        "updateActiveNamespaceId",
        vm.activeNamespaces.length == 0
          ? null
          : vm.activeNamespaces[0].namespace_id
      );
    },
  },
  methods: {
    updateNamespaceSet: function () {
      var vm = this;
      var namespaceSet = new Set();
      // if no namespace is active
      if (vm.activeNamespaces.length == 0) {
        namespaceSet = vm.fullNamespaceSet;
      } else {
        vm.getNamespaceChildrenIds(vm.activeNamespaces[0], namespaceSet);
      }
      vm.$emit("updateNamespaceSet", namespaceSet);
    },
    getNamespaceChildrenIds: function (namespace_obj, namespaceSet) {
      var vm = this;
      namespaceSet.add(namespace_obj.namespace_id);
      for (var i = 0, len = namespace_obj.children.length; i < len; i++) {
        vm.getNamespaceChildrenIds(namespace_obj.children[i], namespaceSet);
      }
    },
    buildNamespaceTree: function (arr) {
      var vm = this;
      var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;

      vm.fullNamespaceSet = new Set();
      // First map the nodes of the array to an object -> create a hash table.
      for (var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.namespace_id] = arrElem;
        mappedArr[arrElem.namespace_id]["children"] = [];
        // while we're here lets build out fullnNamespaceSet
        vm.fullNamespaceSet.add(arrElem.namespace_id);
      }

      for (var namespace_id in mappedArr) {
        mappedElem = mappedArr[namespace_id];
        // If the element is not at the root level, add it to its parent array of children.
        if (mappedElem.parent) {
          mappedArr[mappedElem["parent"]]["children"].push(mappedElem);
        }
        // If the element is at the root level, add it to first level elements array.
        else {
          tree.push(mappedElem);
        }
      }
      return [{

        name: 'All',
        namespace_id: null,
        children: tree
      }
      ];
    },
    createNamespace: function (name) {
      var vm = this;
      vm.createNamespaceDialog = false;
      vm.creating = true;
      var parent =
        vm.activeNamespaces.length == 0
          ? null
          : vm.activeNamespaces[0].namespace_id;
      Auth.currentAuthenticatedUser()
        .then((data) => {
          axios({
            method: vm.$variables.api.createNamespace.method,
            url: vm.$variables.api.createNamespace.url,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken,
            },
            data: {
              name: name,
              parent: parent,
            },
          })
            .then((response) => {
              console.log(response);
              vm.creating = false;
              vm.namespaces = response.data.namespaces;
              vm.namespaceTree = vm.buildNamespaceTree(vm.namespaces);
              vm.activeNamespaces = []
              vm.updateNamespaceSet();
              vm.$emit('updateResources')
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteNamespace: function () {
      var vm = this;
      vm.confirmDeleteDialog = false;
      vm.deleting = true
      // vm.deleting = true;
      Auth.currentAuthenticatedUser()
        .then((data) => {
          axios({
            method: vm.$variables.api.deleteNamespace.method,
            url:
              vm.$variables.api.deleteNamespace.url +
              vm.activeNamespaces[0].namespace_id,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken,
            },
          })
            .then((response) => {
              console.log(response);
              vm.deleting = false;
              vm.namespaces = response.data.namespaces;
              vm.namespaceTree = vm.buildNamespaceTree(vm.namespaces);
              vm.activeNamespaces = []
              vm.updateNamespaceSet();
              vm.$emit('updateResources')
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss">
.v-treeview-node__level {
    width: 12px;
}
</style>