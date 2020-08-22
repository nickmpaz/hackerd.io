<template>
  <div class="text-center">
    <v-dialog v-model="active" persistent width="500">
      <v-card color="secondary" class="pa-6" :dark="$vuetify.theme.dark">
        <div class="title pb-2">Create Resource</div>
        <v-select :items="typeItems" v-model="selectedType" label="Type" single-line return-object></v-select>
        <v-select :items="methodItems" v-model="selectedMethod" label="Method" single-line return-object></v-select>
        <div class="d-flex justify-space-between pt-4">
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
    methodItems: [
      {
        text: "New",
        value: "new",
      },
      {
        text: "Import",
        value: "import",
      },
    ],
    selectedType: null,
    selectedMethod: null,
  }),
  created() {
    var vm = this;
    vm.selectedType = vm.typeItems[0];
    vm.selectedMethod = vm.methodItems[0];
  },
  methods: {
    confirm: function () {
      var vm = this;
      vm.$emit("confirm", vm.selectedType.value, vm.selectedMethod.value);
      // console.log(vm.selectedType);
    },
    decline: function () {
      var vm = this;
      vm.$emit("decline");
    },
  },
};
</script>