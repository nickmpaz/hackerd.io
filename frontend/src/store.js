import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    hotkeysActive: true,
    activeNamespace: {
      name: "All",
      id: 0,
      namespace_id: null,
      resourceFilter: function () {
        return true;
      },
    },
    namespaceSelectorList: [],
  },
  getters: {
    hotkeysActive: state => {
      return state.hotkeysActive
    },
    activeNamespace: state => {
      return state.activeNamespace
    },
    namespaceSelectorList: state => {
      return state.namespaceSelectorList
    }
  },
  mutations: {
    hotkeysActive (state, hotkeysActive) {
      state.hotkeysActive = hotkeysActive
    },
    activeNamespace (state, activeNamespace) {
      state.activeNamespace = activeNamespace
    },
    namespaceSelectorList (state, namespaceSelectorList) {
      state.namespaceSelectorList = namespaceSelectorList
    }
  }
})

export default store