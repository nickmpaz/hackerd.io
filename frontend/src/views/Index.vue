<template>
  <div>
    <loading-dialog :active="loadingDialog" message="Loading" />
    <loading-dialog :active="creatingDialog" message="Creating" />
    <loading-dialog :active="deletingDialog" message="Deleting" />
    <single-prompt-dialog
      :active="createStashDialog"
      prompt="Create Stash"
      prompt-label="Stash name"
      confirmMessage="Create"
      declineMessage="Cancel"
      @confirm="createStash"
      @decline="createStashDialog = false"
    />
    <div v-if="!loadingDialog">
      <h1 class="source-code-pro mb-8">Stashes</h1>
      <div v-if="stashes.length > 0">
        <div class="d-flex align-center mb-6">
          <v-icon class="mr-2">mdi-clock-outline</v-icon>
          <span class="title">Recently Viewed Stashes</span>
        </div>
        <stash-cards :stashes="recentlyViewedStashes" @delete-stash="deleteStash" class="mb-6"/>
      </div>
      <div class="d-flex align-center mb-6">
        <v-icon class="mr-2">mdi-account</v-icon>
        <span class="title">Personal Stashes</span>
      </div>
      <stash-cards
        :stashes="personalStashes"
        :trailingCreateCard="true"
        @create-stash="createStashDialog = true"
        @delete-stash="deleteStash"
      />
    </div>
  </div>
</template>

<script>
import StashCards from "@/components/StashCards";
import LoadingDialog from "@/components/LoadingDialog";
import SinglePromptDialog from "@/components/SinglePromptDialog";

export default {
  components: { StashCards, LoadingDialog, SinglePromptDialog },
  data() {
    return {
      stashes: [],
      loadingDialog: true,
      creatingDialog: false,
      deletingDialog: false,
      createStashDialog: false,
    };
  },
  computed: {
    recentlyViewedStashes: function () {
      var vm = this;
      var recentlyViewedStashes = vm.$utils.deepCopy(vm.stashes);

      recentlyViewedStashes.sort((a, b) =>
        a.viewed_at < b.viewed_at ? 1 : b.viewed_at < a.viewed_at ? -1 : 0
      );
      recentlyViewedStashes = recentlyViewedStashes.slice(0, 4);
      return recentlyViewedStashes;
    },
    personalStashes: function () {
      var vm = this;
      var personalStashes = vm.$utils.deepCopy(vm.stashes);

      personalStashes.sort((a, b) =>
        a.created_at < b.created_at ? 1 : b.created_at < a.created_at ? -1 : 0
      );
      return personalStashes;
    },
  },
  async created() {
    var vm = this;
    await vm.getStashes();
    vm.loadingDialog = false;
  },
  methods: {
    createStash: async function (name) {
      var vm = this;
      vm.createStashDialog = false
      vm.creatingDialog = true
      var stash = await vm.$api.createStash(name);
      vm.creatingDialog = false
      vm.$router.push({
        name: "Stash",
        params: {
          stashId: stash.sk,
        },
      });
    },
    deleteStash: async function (stashId) {
      var vm = this
      vm.deletingDialog = true
      await vm.$api.deleteStash(stashId);
      vm.stashes = vm.stashes.filter(obj => obj.sk != stashId)
      vm.deletingDialog = false

    },
    getStashes: async function () {
      var vm = this;
      vm.stashes = await vm.$api.getStashes();
      console.log(vm.stashes);
    },
  },
};
</script>

<style>
</style>