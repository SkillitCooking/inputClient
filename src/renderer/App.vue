<template>
  <div id="app">
    <h1 class="title">Skillit Admin</h1>
    <nav class="navbar">
      <div class="navbar-brand">
        <router-link to="/recipes" class="navbar-item">Recipes</router-link>
        <router-link to="/ingredients" class="navbar-item">Ingredients</router-link>
        <router-link to="/seasonings" class="navbar-item">Seasonings</router-link>
        <router-link to="/tags" class="navbar-item">Tags</router-link>
        <router-link to="/units" class="navbar-item">Units</router-link>
        <router-link to="/users" class="navbar-item">Users</router-link>
        <router-link to="/mealPlans" class="navbar-item">Meal Plans</router-link>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'input-client'
  }
</script>

<style>
  /* CSS */
</style>
