<template>
  <div>
    <jumper v-if="loading"></jumper>
    <div v-if="!loading">
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
          <button v-on:click="login()" class="button is-primary">Login</button>
      </div>
      <p v-if="isError" class="has-text-danger">There was a login error.</p>
      <p>{{ username }} + {{ email }} + {{ token }} + {{ id }}</p>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import Jumper from 'vue-loading-spinner/src/components/Jumper';

export default {

  components: {
    Jumper
  },

  data: function() {
      return {
        inputPassword: '',
        inputUsername: ''
    };
  },
  //getters for logged in 
  //how does this send payload?
  //And with modules?
  methods: {
    login() {
      this.$store.dispatch('login', {username: this.inputUsername, password: this.inputPassword});
      this.inputUsername = '';
      this.inputPassword = '';
    }
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
    isError() {
      return this.$store.state.Users.loginError.isError;
    },
    loading() {
      return this.$store.state.Loading.loading;
    }
  }
}
</script>

<style scoped>

</style>