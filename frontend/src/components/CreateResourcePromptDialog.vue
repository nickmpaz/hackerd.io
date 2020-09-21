<template>
  <div class="text-center">
    <v-dialog v-model="active" persistent width="500">
      <v-card color="secondary" class="pa-6" :dark="$vuetify.theme.dark">
        <div class="title">Create Resource</div>
        <v-btn-toggle v-model="selectedType" mandatory color="primary" group class="d-flex justify-space-around mt-3 mb-4">
            <v-btn width="100" value="note">Note</v-btn>
            <v-btn width="100" value="link">Link</v-btn>
            <v-btn width="100" value="snippet">Snippet</v-btn>
        </v-btn-toggle>
        <div class="d-flex justify-space-between">
          <v-btn width="150" color="success" @click="confirm">{{ confirmMessage }}</v-btn>
          <v-btn width="150" color="error" @click="decline">{{ declineMessage }}</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["active", "confirmMessage", "declineMessage"],
  data: () => ({
    selectedType: "note",
  }),
  methods: {
    confirm: function () {
      var vm = this;
      vm.$emit("confirm", vm.selectedType);
    },
    decline: function () {
      var vm = this;
      vm.$emit("decline");
    },
  },
};
</script>