<template>
  <div class="fill-height">
    <loading-dialog :active="loading" message="Loading" />
    <div v-if="!loading" class="d-flex flex-column fill-height">
      <h1 v-if="resource.type === 'note'" class="source-code-pro">Note</h1>
      <h1 v-else-if="resource.type === 'link'" class="source-code-pro">Link</h1>
      <h1 v-else-if="resource.type === 'snippet'" class="source-code-pro">Snippet</h1>
      <note-resource
        v-if="resource.type === 'note'"
        :resource="resource"
        :editMode="edit"
        class="flex-grow-1"
      />
      <link-resource
        v-else-if="resource.type === 'link'"
        :resource="resource"
        :editMode="edit"
        class="flex-grow-1"
      />
      <snippet-resource
        v-else-if="resource.type === 'snippet'"
        :resource="resource"
        :editMode="edit"
        class="flex-grow-1"
      />
    </div>
  </div>
</template>

<script>
import LoadingDialog from "../components/LoadingDialog";
import LinkResource from "../components/LinkResource";
import NoteResource from "../components/NoteResource";
import SnippetResource from "../components/SnippetResource";

export default {
  components: {
    LoadingDialog,
    LinkResource,
    NoteResource,
    SnippetResource,
  },
  data: () => ({
    loading: true,
    resource: null,
    edit: false,
  }),
  async created() {
    var vm = this;
    vm.edit = vm.$route.params.edit;
    vm.resource = await vm.$api.getResource(
      vm.$route.params.stashId,
      vm.$route.params.resourceId
    );
    console.log(vm.resource);
    vm.loading = false;
  },
};
</script>
