<template>
    <div>
        <jumper v-if="loading"></jumper>
        <div v-if="!loading">
            <h1 class="title">Recipes Page</h1>
            <action-nav v-bind:path="$route.path"></action-nav>
            <span>{{ username }} + {{ email }} + {{ token }} + {{ id }}</span>
        </div>
    </div>
</template>

<script>
import ActionNav from './lib/ActionNav.vue'
import Jumper from 'vue-loading-spinner/src/components/Jumper';
import store from '../store';
import mutation from '../store/mutation-types';

export default {
  components: {
      ActionNav,
      Jumper
  },
  computed: {
    username() {
      return this.$store.state.Users.user.username;
    },
    token() {
      return this.$store.state.Users.user.token;
    },
    email() {
      return this.$store.state.Users.user.email;
    },
    id() {
      return this.$store.state.Users.user.id;
    },
    loading()  {
        return this.$store.state.Loading.loading;
    } 
  },
  beforeRouteEnter(to, from, next) {
      if(!store.state.Loading.loading) {
        store.commit(mutation.LOADING.START);
      }
      setTimeout(() => {
        store.commit(mutation.LOADING.STOP);
        next();
      }, 1000)
  }
}
</script>
<style scoped>

</style>