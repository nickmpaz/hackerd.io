import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    activeNamespaceSet: new Set(),
    selectedNamespace: {
      name: ""
    }
  },
  getters: {
    activeNamespaceSet: state => {
      return state.activeNamespaceSet
    },
    selectedNamespace: state => {
      return state.selectedNamespace
    }
  },
  mutations: {
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