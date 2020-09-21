import Vue from 'vue'
import VueRouter from 'vue-router'
// import Index from '../views/Index.vue'
import SignIn from '../views/SignIn.vue'
import { Auth } from 'aws-amplify'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Index',
  //   component: Index,
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: SignIn,
    meta: { requiresAuth: false }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/integrations',
    name: 'Integrations',
    component: () => import('../views/Integrations.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:stashId',
    name: 'Stash',
    component: () => import('../views/Stash.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:stashId/:resourceId',
    name: 'Resource',
    component: () => import('../views/Resource.vue'),
    meta: { requiresAuth: true }
  },

]

const router = new VueRouter({
  // mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  var authenticated = false
  Auth.currentAuthenticatedUser()
    .then(() => {
      authenticated = true
    })
    .catch(() => {
      authenticated = false
    })
    .finally(() => {
      if (
        to.matched.some(record => record.meta.requiresAuth) &&
        !authenticated
      ) {
        next('/auth')
      } else if (
        !to.matched.some(record => record.meta.requiresAuth) &&
        authenticated
      ) {
        next('/')
      } else {
        next()
      }
    })
})

export default router
