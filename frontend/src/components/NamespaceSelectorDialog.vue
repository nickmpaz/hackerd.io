<template>
  <div class="text-center">
    <v-dialog v-model="active" persistent width="500">
      <v-card color="secondary" class="px-8" :dark="$vuetify.theme.dark">
        <div class="title pt-4">Select Namespace</div>
        <v-select :items="items" v-model="selected" label="Namespaces" single-line ></v-select>
        <div class="d-flex justify-space-between pb-6 pt-2">
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
    selected: null,
  }),
  computed: {
    items: function () {
      return this.$store.getters.namespaceSelectorList;
    },
  },
  methods: {
    confirm: function () {
      var vm = this;
      vm.$emit("confirm", vm.selected);
    },
    decline: function () {
      var vm = this;
      vm.$emit("decline");
    },
  },
};
</script>