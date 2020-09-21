<template>
  <div class="d-flex">
    <div v-for="(namespace, index) in breadcrumbsList" :key="index" class="d-flex align-center">
      <v-icon class="mr-1">mdi-chevron-right</v-icon>
      <span
        class="primary--text cursor-pointer mr-1"
        @click="changeNamespace(namespace)"
      >{{ namespace.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    namespace: function () {
      return this.$store.getters.namespace;
    },
    namespaceMap: function () {
      return this.$store.getters.namespaceMap;
    },
    breadcrumbsList: function () {
      var vm = this;
      var breadcrumbsList = [];
      var currNamespaceId = vm.namespace.sk;

      //if current namespace is a dummy namespace
      if (currNamespaceId == null) {
        breadcrumbsList = [vm.namespace];
        return breadcrumbsList;
      }

      while (currNamespaceId != null) {
        var currNamespace = vm.namespaceMap[currNamespaceId];
        breadcrumbsList.unshift(currNamespace);
        var parentNamespace = vm.namespaceMap[currNamespace.parent];
        currNamespaceId = parentNamespace
          ? vm.namespaceMap[currNamespace.parent].sk
          : null;
      }

      return breadcrumbsList;
    },
  },
  methods: {
    changeNamespace: function (namespace) {
      if (namespace.sk == this.namespace.sk) return;
      this.$store.commit("namespace", namespace.sk);
    },
  },
};
</script>

<style>
</style>