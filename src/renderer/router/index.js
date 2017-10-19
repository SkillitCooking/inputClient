import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

/**
 * TODO - for Promise.all before enter fetches, could have kind of encapsulating LOADING,
 * and pass to fetch dispatches parameter that indicates to not individually manipulate loading
 * mutations from there
 */

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
      component: require('@/components/RecipesPage'),
      beforeEnter: async function(to, from, next) {
        await Promise.all([
          store.dispatch('fetchTags'),
          store.dispatch('fetchSeasonings'),
          store.dispatch('fetchIngredients'),
          store.dispatch('fetchRecipes')
        ]);
        next();
      }
    },
    {
      path: '/ingredients',
      name: 'ingredients-page',
      component: require('@/components/IngredientsPage'),
      beforeEnter: async function(to, from, next) {
        await Promise.all([
          store.dispatch('fetchTags'),
          store.dispatch('fetchUnits'),
          store.dispatch('fetchIngredients')
        ]);
        next();
      }
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
      path: '/users',
      name: 'users-page',
      component: require('@/components/UsersPage'),
      beforeEnter: async function(to, from, next) {
        await store.dispatch('fetchUsers');
        next();
      }
    },
    {
      path: '/mealPlans',
      name: 'meal-plans-page',
      component: require('@/components/MealPlansPage'),
      beforeEnter: async function(to, from, next) {
        await Promise.all([
          store.dispatch('fetchUsers'),
          store.dispatch('fetchRecipes')
        ]);
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
