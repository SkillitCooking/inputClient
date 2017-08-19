<template>
    <div>
        <jawn v-if="loading"></jawn>
        <div v-show="!loading">
            <p v-if="saveSuccess" class="has-text-success">You saved {{savedTag}} successfully!</p>
            <p v-if="isError" class="has-text-danger">There was an error</p>
            <div class="field">
                <label class="label">Name</label>
                <div class="control">
                    <input v-validate="'required'" name="name" v-model="inputName" class="input" type="text" placeholder="Input Tag's Name">
                </div>
                <p v-show="errors.has('name')" class="help is-danger">Required</p>
            </div>
            <div class="field">
                <div class="control">
                    <button v-on:click="save()" class="button is-primary">Save</button>
                </div>
            </div>
            <h5 class="title is-5">Current Tags</h5>
            <div class="tags">
                <span class="tag" v-for="tag in tags" :key="tag.id">{{ tag.name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import Jawn from 'vue-loading-spinner/src/components/Jawn';

export default {
  components: {
    Jawn
  },
  data: function() {
    return {
          saveSuccess: false,
          isError: false,
          inputName: ''
      };
  },
  methods: {
      save() {
          this.$store.dispatch('saveTag', {name: this.inputName})
            .then((savedTag) => {
                this.saveSuccess = true;
                this.savedTag = savedTag;
                this.isError = false;
                this.inputName = '';
            })
            .catch(() => {
                this.saveSuccess = false;
                this.isError = true;
                this.savedTag = null;
            });
      }
  },
  computed: {
      loading() {
          return this.$store.state.Loading.loading;
      },
      tags() {
          return this.$store.state.Tags.tags;
      }
  }
}
</script>

<style scoped>

</style>
