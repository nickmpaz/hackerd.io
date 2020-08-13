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
      @decline="closeConfirmDeleteDialog"
    />
    <div class="d-flex justify-end py-1">
      <v-btn
        @click="openConfirmDeleteDialog"
        x-small
        color="transparent"
        depressed
      >
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
    dummyTree: [
      { name: "All", id: 0 },
      { name: "New", id: 1 },
    ],
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
    activeNamespace: function () {
      var vm = this;
      var activeNamespace =
        vm.activeNamespaces.length == 0 ? null : vm.activeNamespaces[0];
      return activeNamespace;
    },

    activeNamespaceSet: function () {
      var vm = this;
      var activeNamespaceSet =
        vm.activeNamespaces.length == 0
          ? vm.namespaceSet
          : vm.getNamespaceChildrenIds(vm.activeNamespaces[0]);
      return activeNamespaceSet;
    },
    namespaceTree: function () {
      var vm = this;
      var arr = JSON.parse(JSON.stringify(vm.namespaces));
      var tree = [];
      var mappedArr = {};
      var arrElem;
      var mappedElem;

      for (var i = 0; i < arr.length; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.namespace_id] = arrElem;
        mappedArr[arrElem.namespace_id]["children"] = [];
      }

      for (var namespace_id in mappedArr) {
        mappedElem = mappedArr[namespace_id];
        if (mappedElem.parent) {
          mappedArr[mappedElem["parent"]]["children"].push(mappedElem);
        } else {
          tree.push(mappedElem);
        }
      }

      return tree;
    },
    namespaceSet: function () {
      var vm = this;
      var namespaceSet = new Set();
      for (var i = 0, len = vm.namespaces.length; i < len; i++) {
        namespaceSet.add(vm.namespaces[i].namespace_id);
      }
      return namespaceSet;
    },
  },
  watch: {
    activeNamespaces: function (activeNamespaces) {
      var vm = this
      vm.$store.commit("updateSelectedNamespace", vm.activeNamespace);
      vm.$store.commit("updateActiveNamespaceSet", vm.activeNamespaceSet);
      // a namespace was selected
      if (activeNamespaces.length != 0) {
        if (this.$route.name !== "Index") {
          this.$router.push({ name: "Index" });
        }
        this.activeDummy = [];
        // a namespace was deselected
      } else if (activeNamespaces.length == 0 && this.activeDummy.length == 0) {
        this.activeDummy = [this.dummyTree[0]];
      }
    },
    activeDummy: function (activeDummy) {
      // a dummy namespace was selected
      if (activeDummy.length != 0) {
        if (this.$route.name !== "Index") {
          this.$router.push({ name: "Index" });
        }
        this.activeNamespaces = [];
        // a dummy namespace was deselected
      } else if (activeDummy.length == 0 && this.activeNamespaces.length == 0) {
        this.activeDummy = [this.dummyTree[0]];
      }
    },
    namespaces: function() {
      var vm = this
      vm.$store.commit("updateSelectedNamespace", vm.activeNamespace);
      vm.$store.commit("updateActiveNamespaceSet", vm.activeNamespaceSet);
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
    this.activeDummy = [this.dummyTree[0]];
  },
  methods: {
    openCreateNamespaceDialog: function () {
      var vm = this
      vm.$store.commit("hotkeysActive", false);
      vm.createNamespaceDialog = true
    },
    closeCreateNamespaceDialog: function () {
      var vm = this
      vm.$store.commit("hotkeysActive", true);
      vm.createNamespaceDialog = false
    },
    openConfirmDeleteDialog: function() {
      var vm = this
      if(!vm.activeNamespace) return
      vm.confirmDeleteDialog = true
      vm.$store.commit("hotkeysActive", false);
    },
    closeConfirmDeleteDialog: function() {
      var vm = this
      vm.$store.commit("hotkeysActive", true);
      vm.confirmDeleteDialog = false
    },
    getNamespaceChildrenIds: function (namespace_obj) {
      var vm = this;
      var namespaceChildrenIds = new Set();
      for (var i = 0, len = namespace_obj.children.length; i < len; i++) {
        namespaceChildrenIds = new Set([
          ...namespaceChildrenIds,
          ...vm.getNamespaceChildrenIds(namespace_obj.children[i]),
        ]);
      }
      namespaceChildrenIds.add(namespace_obj.namespace_id);
      return namespaceChildrenIds;
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
              vm.activeNamespaces[0].namespace_id,
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken,
            },
          })
            .then((response) => {
              console.log(response);
              vm.deleting = false;
              vm.namespaces = response.data.namespaces;
              vm.activeNamespaces = [];
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