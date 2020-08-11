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
    dummyTree: [
      { name: "All", id: 0 },
      { name: "New", id: 1 },
    ],
    createNamespaceDialog: false,
    openItems: [],
    activeNamespaces: [],
    activeDummy: [],
    namespaceTree: [],
    namespaces: [],
    namespaceSet: new Set(),
    confirmDeleteDialog: false,
    creating: false,
    deleting: false,
  }),
  // watch: {
  //   // whenever question changes, this function will run
  //   activeNamespaces: function (activeNamespaces) {
  //     this.setVuexNamespaceData();
  //     if (this.$route.name !== "Index") {
  //       this.$router.push({ name: "Index" });
  //     }
  //     if (activeNamespaces.length != 0) {
  //       this.activeDummy = [];
  //     }
  //   },
  //   activeDummy: function (activeDummy) {
  //     console.log("set");
  //     if (activeDummy.length == 0) {
  //       return;
  //     } else if (activeDummy[0] == this.dummyTree[0]) {
  //       // this.activeNamespaces = [];
  //       console.log('all')
  //       if (activeDummy.length != 0) {
  //         this.activeNamespaces = []
  //       }
  //     }
  //   },
  // },
  watch: {
    // whenever question changes, this function will run
    activeNamespaces: function (activeNamespaces) {
      if (activeNamespaces.length != 0) {
        if (this.$route.name !== "Index") {
          this.$router.push({ name: "Index" });
        }
        this.activeDummy = [];
        this.setVuexNamespaceData();
      }
    },
    activeDummy: function (activeDummy) {
      if (activeDummy.length != 0) {
        if (this.$route.name !== "Index") {
          this.$router.push({ name: "Index" });
        }
        this.activeNamespaces = [];
        this.setVuexNamespaceData();
      } else if (activeDummy.length == 0 && this.activeNamespaces.length == 0) {
        this.activeDummy = [this.dummyTree[0]];
      }
    },
  },
  computed: {
    // activeDummy: {
    //   get: function () {
    //     console.log("get");
    //     return [this.dummyTree[0]];
    //   },
    //   set: function (activeDummy) {
    //   },
    // },
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
            vm.setNavigatorData(response.data.namespaces);
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
    setVuexNamespaceData: function () {
      var vm = this;
      vm.$store.commit(
        "updateActiveNamespaceSet",
        vm.activeNamespaces.length == 0
          ? vm.namespaceSet
          : vm.getNamespaceChildrenIds(vm.activeNamespaces[0])
      );
      vm.$store.commit(
        "updateSelectedNamespace",
        vm.activeNamespaces.length == 0 ? null : vm.activeNamespaces[0]
      );
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
      console.log("adding", namespace_obj.namespace_id);
      namespaceChildrenIds.add(namespace_obj.namespace_id);
      return namespaceChildrenIds;
    },
    setNavigatorData: function (namespaceArr) {
      console.log("namnespaearr", namespaceArr);
      var vm = this;
      vm.namespaces = JSON.parse(JSON.stringify(namespaceArr));
      vm.namespaceTree = vm.buildNamespaceTree(namespaceArr);
      vm.namespaceSet = vm.buildNamespaceSet(namespaceArr);
      vm.setVuexNamespaceData();
    },

    buildNamespaceSet: function (arr) {
      var namespaceSet = new Set();
      for (var i = 0, len = arr.length; i < len; i++) {
        namespaceSet.add(arr[i]);
      }
      return namespaceSet;
    },
    buildNamespaceTree: function (arr) {
      var tree = [];
      var mappedArr = {};
      var arrElem;
      var mappedElem;

      for (var i = 0, len = arr.length; i < len; i++) {
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
              vm.setNavigatorData(JSON.parse(JSON.stringify(vm.namespaces)));
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
              vm.setNavigatorData(response.data.namespaces);
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