<template>
  <div>
    <div v-if="collapse">
      <v-menu bottom offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" :width="menuWidth">
            <v-icon left>{{ menuIcon }}</v-icon>
            <span>{{ menuText }}</span>
          </v-btn>
        </template>
        <v-list dense>
          <div v-for="(item, index) in items" :key="index">
            <v-list-item link @click="item.function">
              <v-list-item-action>
                <v-icon :color="item.iconColor">{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list>
      </v-menu>
    </div>
    <div v-else class="d-flex flex-row-reverse">
      <div v-for="(item, index) in items" :key="index">
        <v-btn
          :color="item.buttonColor"
          :width="item.buttonWidth"
          :class="index == 0 ? '': 'mr-4'"
          @click="item.function"
        >
          <v-icon left :color="item.iconColor">{{ item.icon }}</v-icon>
          {{ item.text }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["collapse", "items", "menuWidth", "menuText", "menuIcon"],
  data: () => ({}),
  methods: {},
};
</script>