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
    namespaceBreadcrumbsList: [],
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
    },
    namespaceBreadcrumbsList: state => {
      return state.namespaceBreadcrumbsList
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
    },
    namespaceBreadcrumbsList (state, namespaceBreadcrumbsList) {
      state.namespaceBreadcrumbsList = namespaceBreadcrumbsList
    }
  }
})

export default store