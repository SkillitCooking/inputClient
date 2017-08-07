<template>
  <div>
    <h1 class="title">Login</h1>
    <div class="field">
        <label class="label">UserName</label>
        <input v-model="inputUsername" class="input" type="text" placeholder="Input User Name">
    </div>
    <div class="field">
        <label class="label">Password</label>
        <input v-model="inputPassword" class="input" type="text" placeholder="Input Password">
    </div>
    <div class="field">
        <button v-on:click="login({username: inputUsername, password: inputPassword})" class="button is-primary">Login</button>
    </div>
    <span>{{ username }} + {{ email }} + {{ token }} + {{ id }} + Clicks: {{ clicks }}</span>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {

  data: function() {
      return {
        clicks: 0,
        inputPassword: '',
        inputUsername: ''
    };
  },
  //getters for logged in 
  //how does this send payload?
  //And with modules?
  methods: {
    ...mapActions(['login'])
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
    }
  }
}
</script>

<style scoped>

</style>