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
      @decline="closeCreateNamespaceDialog"
    />
    <confirm-dialog
      :active="confirmDeleteDialog"
      prompt="Delete this namespace and all resources that belong to it?"
      confirmMessage="delete"
      declineMessage="cancel"
      @confirm="deleteNamespace"
      @decline="closeConfirmDeleteDialog"
    />
    <div class="d-flex justify-end py-1">
      <v-btn @click="openConfirmDeleteDialog" x-small color="transparent" depressed>
        <v-icon class>mdi-delete</v-icon>
      </v-btn>
      <v-btn @click="openCreateNamespaceDialog" x-small color="transparent" depressed>
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
      :active.sync="activeDummy"
      :items="dummyTree"
      return-object
    ></v-treeview>
    <hr class="my-2" />
    <v-treeview
      dense
      hoverable
      activatable
      :active.sync="activeNamespaces"
      :items="namespaceTree"
      item-key="namespace_id"
      :open.sync="openItems"
      expand-icon="mdi-chevron-down"
      return-object
      open-all
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
    activeDummy: [],
    namespaces: [],
    confirmDeleteDialog: false,
    creating: false,
    deleting: false,
  }),
  computed: {
    dummyTree: function () {
      var vm = this
      return [
        {
          name: "All",
          id: 0,
          namespace_id: null,
          filter: function (resource_obj) {
            console.log(vm.namespaceSet)
            return vm.namespaceSet.has(resource_obj.namespace) || resource_obj.namespace == null;
          },
        },
        {
          name: "Unlabeled",
          id: 2,
          namespace_id: null,
          filter: function (resource_obj) {
            return resource_obj.title == "" || resource_obj.tags.length == 0;
          },
        },
        {
          name: "New",
          id: 3,
          namespace_id: null,
          filter: function (resource_obj) {
            return vm.namespaceSet.has(resource_obj.namespace) || resource_obj.namespace == null;
          },
        },
      ];
    },
    activeNamespace: function () {
      var vm = this;
      if (vm.activeNamespaces.length > 0) {
        return vm.activeNamespaces[0];
      } else if (vm.activeDummy.length > 0) {
        return vm.activeDummy[0];
      } else {
        return vm.dummyTree[0];
      }
    },
    namespaceTree: function () {
      var vm = this;
      var namespaces = JSON.parse(JSON.stringify(vm.namespaces));
      var namespaceTree = [];
      var mappedNamespaces = {};
      var arrElem;
      var mappedElem;
      for (var i = 0; i < namespaces.length; i++) {
        arrElem = namespaces[i];
        mappedNamespaces[arrElem.namespace_id] = arrElem;
        mappedNamespaces[arrElem.namespace_id]["children"] = [];
      }
      for (var namespace_id in mappedNamespaces) {
        mappedElem = mappedNamespaces[namespace_id];
        if (mappedElem.parent) {
          mappedNamespaces[mappedElem["parent"]]["children"].push(mappedElem);
        } else {
          namespaceTree.push(mappedElem);
        }
      }
      for (var j in mappedNamespaces) {
        mappedElem = mappedNamespaces[j];
        mappedElem.namespaceFilterSet = vm.getNamespaceFilterSet(mappedElem);
        mappedElem.filter = function (resource_obj) {
          console.log(resource_obj);
          console.log(this.namespaceFilterSet);
          return this.namespaceFilterSet.has(resource_obj.namespace);
        };
      }
      return namespaceTree;
    },
    namespaceSet: function () {
      var vm = this;
      var namespaceSet = new Set();
      for (var i = 0; i < vm.namespaces.length; i++) {
        namespaceSet.add(vm.namespaces[i].namespace_id);
      }
      return namespaceSet;
    },
  },
  watch: {
    activeNamespaces: function (newActiveNamespaces, oldActiveNamespaces) {
      var vm = this;
      if (vm.$route.name !== "Index") {
        vm.$router.push({ name: "Index" });
      }
      // a namespace was selected
      if (newActiveNamespaces.length != 0) {
        vm.activeDummy = [];
        vm.$store.commit("activeNamespace", vm.activeNamespace);

        // a namespace was deselected
      } else if (
        newActiveNamespaces.length == 0 &&
        vm.activeDummy.length == 0
      ) {
        console.log("namespace deselected");
        vm.activeNamespaces.push(oldActiveNamespaces[0]);
      }
    },
    activeDummy: function (newActiveDummy, oldActiveDummy) {
      var vm = this;
      if (vm.$route.name !== "Index") {
        vm.$router.push({ name: "Index" });
      }
      // a dummy namespace was selected
      if (newActiveDummy.length != 0) {
        vm.activeNamespaces = [];
        vm.$store.commit("activeNamespace", vm.activeNamespace);

        // a dummy namespace was deselected
      } else if (
        newActiveDummy.length == 0 &&
        vm.activeNamespaces.length == 0
      ) {
        vm.activeDummy.push(oldActiveDummy[0]);
      }
    },
  },
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
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  created() {
    var vm = this
    vm.activeDummy = [vm.dummyTree[0]]
  },
  methods: {

    getNamespaceFilterSet: function (namespace_obj) {
      var vm = this;
      var namespaceFilterSet = new Set();
      for (var i = 0, len = namespace_obj.children.length; i < len; i++) {
        namespaceFilterSet = new Set([
          ...namespaceFilterSet,
          ...vm.getNamespaceFilterSet(namespace_obj.children[i]),
        ]);
      }
      namespaceFilterSet.add(namespace_obj.namespace_id);
      return namespaceFilterSet;
    },
    openCreateNamespaceDialog: function () {
      var vm = this;
      vm.$store.commit("hotkeysActive", false);
      vm.createNamespaceDialog = true;
    },
    closeCreateNamespaceDialog: function () {
      var vm = this;
      vm.$store.commit("hotkeysActive", true);
      vm.createNamespaceDialog = false;
    },
    openConfirmDeleteDialog: function () {
      var vm = this;
      if (vm.activeNamespaces.length == 0) return
      vm.$store.commit("hotkeysActive", false);
      vm.confirmDeleteDialog = true;
    },
    closeConfirmDeleteDialog: function () {
      var vm = this;
      vm.$store.commit("hotkeysActive", true);
      vm.confirmDeleteDialog = false;
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
              vm.namespaces.push(response.data.namespace);
              if (vm.openItems.indexOf(vm.activeNamespace) == -1) {
                vm.openItems.push(vm.activeNamespace);
              }
              vm.activeNamespaces = [response.data.namespace];
              vm.$store.commit("hotkeysActive", true);
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
      vm.deleting = true;
      Auth.currentAuthenticatedUser()
        .then((data) => {
          axios({
            method: vm.$variables.api.deleteNamespace.method,
            url:
              vm.$variables.api.deleteNamespace.url +
              vm.activeNamespace.namespace_id,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken,
            },
          })
            .then((response) => {
              console.log(response);
              vm.deleting = false;
              vm.namespaces = response.data.namespaces;
              // vm.activeNamespaces = [];
              vm.activeDummy = [vm.dummyTree[0]];
              vm.$store.commit("hotkeysActive", true);
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