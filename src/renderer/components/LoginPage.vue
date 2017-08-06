<template>
  <div>
    <h1 class="title">Login</h1>
    <div class="field">
        <label class="label">UserName</label>
        <input v-model="username" class="input" type="text" placeholder="Input User Name">
    </div>
    <div class="field">
        <label class="label">Password</label>
        <input v-model="password" class="input" type="text" placeholder="Input Password">
    </div>
    <div class="field">
        <button v-on:click="counter" class="button is-primary">Login</button>
    </div>
    <span>{{ username }} + {{ password }} + Clicks: {{ clicks }}</span>
    <span>{{ sample() }}</span>
  </div>
</template>

<script>
import api from '../api'
export default {

  data: function() {
      return {
        username: "",
        password: "",
        clicks: 0
    };
  },
  methods: {
    counter: function(event) {
        this.clicks++;
    },
    sample: function() {
      return api.sample();
    }
  }
}
</script>

<style scoped>

</style>