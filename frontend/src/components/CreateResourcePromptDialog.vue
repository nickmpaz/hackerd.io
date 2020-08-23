<template>
  <div class="text-center">
    <v-dialog v-model="active" persistent width="500">
      <v-card color="secondary" class="pa-6" :dark="$vuetify.theme.dark">
        <div class="title pb-6">Create Resource</div>
        <v-select :items="typeItems" v-model="selectedType" label="Type" solo return-object></v-select>
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
    typeItems: [
      {
        text: "Note",
        value: "note",
      },
      {
        text: "Link",
        value: "link",
      },
    ],
    selectedType: null,
  }),
  created() {
    var vm = this;
    vm.selectedType = vm.typeItems[0];
  },
  methods: {
    confirm: function () {
      var vm = this;
      vm.$emit("confirm", vm.selectedType.value);
    },
    decline: function () {
      var vm = this;
      vm.$emit("decline");
    },
  },
};
</script>