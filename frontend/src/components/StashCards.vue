<template>
  <v-row>
    <v-col v-for="(stash, index) in stashes" :key="index" cols="12" sm="6" md="4" lg="3">
      <v-card
        height="150"
        class="pa-2 d-flex align-center justify-center"
        color="secondary"
        @click="$router.push({name: 'Stash', params: {stashId: stash.sk }})"
        :ripple="false"
      >
        <span class="title">{{ stash.name || '[Undefined]'}}</span>
        <div style="position: absolute; right: 5px; top: 5px;">
          <v-menu bottom offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" class="ml-4">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item link @click="deleteStash(stash.sk)">
                <v-list-item-action>
                  <v-icon color="red">mdi-delete</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-card>
    </v-col>
    <v-col v-if="trailingCreateCard" cols="12" sm="6" md="4" lg="3">
      <v-card height="150" class="pa-2" color="secondary" @click="createStash">
        <div class="d-flex justify-center align-center fill-height">
          <v-icon class="mr-2" color="primary">mdi-plus</v-icon>
          <span class="title primary--text">Create new stash</span>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["stashes", "trailingCreateCard"],
  components: {},

  methods: {
    createStash: function () {
      var vm = this;
      vm.$emit("create-stash");
    },
    deleteStash: function (stashId) {
      var vm = this;
      vm.$emit("delete-stash", stashId);
    },
  },
};
</script>

<style>
</style>