import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage')
    },
    {
      path: '/login',
      name: 'login-page',
      component: require('@/components/LoginPage')
    },
    {
      path: '/recipes',
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
      component: require('@/components/SeasoningsPage')
    },
    {
      path: '/tags',
      name: 'tags-page',
      component: require('@/components/TagsPage')
    },
    {
      path: '/units',
      name: 'units-page',
      component: require('@/components/UnitsPage')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
