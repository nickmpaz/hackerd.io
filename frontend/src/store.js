import Vue from 'vue'
import Vuex from 'vuex'
import utils from './utils'

Vue.use(Vuex)

function getNamespaceFilterSet(namespace_obj) {
  var namespaceFilterSet = new Set();
  for (var i = 0, len = namespace_obj.children.length; i < len; i++) {
    namespaceFilterSet = new Set([
      ...namespaceFilterSet,
      ...getNamespaceFilterSet(namespace_obj.children[i]),
    ]);
  }
  namespaceFilterSet.add(namespace_obj.sk);
  return namespaceFilterSet;
}

const store = new Vuex.Store({
  state: {
    namespaces: [], // list of namespaces
    namespaceMap: {}, // map of namespaceId -> namespace object
    namespaceTree: [], // tree structure of namespaces
    dummyNamespaceTree: [
      {
        name: "All",
        id: 0,
        sk: null,
      },
      {
        name: "Unlabeled",
        id: 1,
        sk: null,
      },
      {
        name: "Recent",
        id: 2,
        sk: null,
      },
    ],
    activeNamespace: [], // namespaceId of active namespace
    activeDummyNamespace: [], // namespaceId of active namespace
    stashId: "",
  },
  getters: {
    namespaces: state => { return state.namespaces },
    namespaceMap: state => { return state.namespaceMap },
    namespaceTree: state => { return state.namespaceTree },
    activeNamespace: state => { return state.activeNamespace },
    activeDummyNamespace: state => { return state.activeDummyNamespace },
    dummyNamespaceTree: state => { return state.dummyNamespaceTree },
    namespace: (state) => {
      if (state.activeNamespace.length > 0) {
        return state.namespaceMap[state.activeNamespace[0]]
      } else if (state.activeDummyNamespace.length > 0) {
        return state.dummyNamespaceTree[state.activeDummyNamespace[0]]
      } else {
        return state.dummyNamespaceTree[0]
      }
    },
    stashId: state => { return state.stashId },

  },
  mutations: {
    namespaces(state, namespaces) {
      state.namespaces = namespaces
      namespaces = utils.deepCopy(namespaces)
      var namespaceTree = []
      var namespaceMap = {}

      for (var i = 0; i < namespaces.length; i++) {
        namespaceMap[namespaces[i].sk] = namespaces[i];
        namespaceMap[namespaces[i].sk]["children"] = [];
      }
      for (var namespaceId in namespaceMap) {
        if (namespaceMap[namespaceId].parent) {
          namespaceMap[namespaceMap[namespaceId]["parent"]]["children"].push(namespaceMap[namespaceId]);
        } else {
          namespaceTree.push(namespaceMap[namespaceId]);
        }
      }

      for (namespaceId in namespaceMap) {
        namespaceMap[namespaceId].namespaceFilterSet = getNamespaceFilterSet(namespaceMap[namespaceId]);
      }
      state.namespaceMap = namespaceMap
      state.namespaceTree = namespaceTree
    },
    activeNamespace(state, activeNamespace) {
      state.activeNamespace = activeNamespace
    },
    activeDummyNamespace(state, activeDummyNamespace) {
      state.activeDummyNamespace = activeDummyNamespace
    },
    namespace(state, namespace) {
      if (namespace == null) {
        state.activeNamespace = []
        state.activeDummyNamespace = [0]
      } else if (namespace in state.namespaceMap) {
        state.activeDummyNamespace = []
        state.activeNamespace = [namespace]
      } else if (namespace < state.dummyNamespaceTree.length) {
        state.activeNamespace = []
        state.activeDummyNamespace = [namespace]
      } else {
        state.activeNamespace = []
        state.activeDummyNamespace = [0]
      }
    },
    stashId(state, stashId) {
      state.stashId = stashId
    },
  }
})

export { store };