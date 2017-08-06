<template>
  <nav class="navbar">
      <div class="navbar-brand">
        <router-link to="/units" class="navbar-item">blah blah {{ path }} </router-link>
        <a class="navbar-item">Hellow</a>
      </div>
  </nav>
</template>

<script>
export default {
  props: ['path']
}
</script>

<style scoped>

</style>
