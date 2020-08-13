import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    hotkeysActive: true,
    activeNamespaceSet: new Set(),
    selectedNamespace: {
      name: ""
    }
  },
  getters: {
    hotkeysActive: state => {
      return state.hotkeysActive
    },
    activeNamespaceSet: state => {
      return state.activeNamespaceSet
    },
    selectedNamespace: state => {
      return state.selectedNamespace
    }
  },
  mutations: {
    hotkeysActive (state, hotkeysActive) {
      state.hotkeysActive = hotkeysActive
    },
    updateActiveNamespaceSet (state, activeNamespaceSet) {
      console.log('update', activeNamespaceSet)
      state.activeNamespaceSet = activeNamespaceSet
    },
    updateSelectedNamespace (state, selectedNamespace) {
      state.selectedNamespace = selectedNamespace
    },
  }
})

export default store