import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/landing-page',
      name: 'landing-page',
      component: require('@/components/LandingPage')
    },
    {
      path: '/login',
      name: 'login-page',
      component: require('@/components/LoginPage'),
      beforeEnter: function(to, from, next) {
        if(store.getters.isAuthorized) {
          next('/');
        } else {
          next();
        }
      }
    },
    {
      path: '/',
      name: 'recipes-page',
      component: require('@/components/RecipesPage')
    },
    {
      path: '/ingredients',
      name: 'ingredients-page',
      component: require('@/components/IngredientsPage')
    },
    {
      path: '/seasonings',
      name: 'seasonings-page',
      component: require('@/components/SeasoningsPage'),
      beforeEnter: async function(to, from, next) {
        await store.dispatch('fetchSeasonings');
        next();
      }
    },
    {
      path: '/tags',
      name: 'tags-page',
      component: require('@/components/TagsPage'),
      beforeEnter: async function(to, from, next) {
        await store.dispatch('fetchTags');
        next();
      }
    },
    {
      path: '/units',
      name: 'units-page',
      component: require('@/components/UnitsPage'),
      beforeEnter: async function(to, from, next) {
        await store.dispatch('fetchUnits');
        next();
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});

router.beforeEach((to, from, next) => {
  if(store.getters.isAuthorized || to.path === '/login') {
    next();
  } else {
    next('/login');
  }
});

export default router;
