<template>
    <div>
        <h1 class="title">Recipes Page</h1>
        <action-nav v-bind:path="$route.path"></action-nav>
    </div>
</template>

<script>
import ActionNav from './lib/ActionNav.vue'

export default {
  components: {
      ActionNav
  }
}
</script>

<style scoped>

</style>
