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
  },
  getters: {
    hotkeysActive: state => {
      return state.hotkeysActive
    },
    activeNamespace: state => {
      return state.activeNamespace
    },

  },
  mutations: {
    hotkeysActive (state, hotkeysActive) {
      state.hotkeysActive = hotkeysActive
    },
    activeNamespace (state, activeNamespace) {
      state.activeNamespace = activeNamespace
    }
  }
})

export default store