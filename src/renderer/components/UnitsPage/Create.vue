<template>
  <div>
      <scale-out v-if="loading"></scale-out>
      <div v-show="!loading">
          <p v-if="saveSuccess" class="has-text-success">You saved {{savedUnit}} successfully</p>
          <p v-if="isError" class="has-text-danger">There was an error</p>
          <div class="field">
              <label class="label">Singular Name</label>
              <div class="control">
                <input v-model="inputNameSingular" class="input" type="text" placeholder="Input Singular Name">
              </div>
              <p class="help">Required</p>
          </div>
          <div class="field">
              <label class="label">Plural Name</label>
              <div class="control">
                <input v-model="inputNamePlural" class="input" type="text" placeholder="Input Plural Name">
              </div>
              <p class="help">Required</p>
          </div>
          <div class="field">
              <label class="label">Abbreviation</label>
              <div class="control">
                <input v-model="inputAbbreviation" class="input" type="text" placeholder="Input Abbreviation">
              </div>
              <p class="help">Optional</p>
          </div>
          <div class="field">
              <div class="control">
                <button v-on:click="save()" class="button is-primary">Save</button>
              </div>
          </div>
          <h5 class="title is-5">Current Units</h5>
          <div class="tags">
              <span class="tag" v-for="unit in units" :key="unit.id">{{ unit.nameSingular }}</span>
          </div>
      </div>
  </div>
</template>

<script>
import ScaleOut from 'vue-loading-spinner/src/components/ScaleOut'

export default {
    components: {
        ScaleOut
    },
    data: function() {
        return {
            saveSuccess: false,
            isError: false,
            inputNameSingular: '',
            inputNamePlural: '',
            inputAbbreviation: ''
        };
    },
    computed: {
        loading() {
            return this.$store.state.Loading.loading;
        },
        units() {
            return this.$store.state.Units.units;
        }
    },
    methods: {
        save() {
            this.$store.dispatch('saveUnit', {
                nameSingular: this.inputNameSingular,
                namePlural: this.inputNamePlural,
                abbreviation: this.inputAbbreviation
            })
            .then((savedUnit) => {
                this.saveSuccess = true;
                this.isError = false;
                this.savedUnit = savedUnit;
                this.inputAbbreviation = '';
                this.inputNamePlural = '';
                this.inputNameSingular = '';
            })
            .catch(() => {
                this.saveSuccess = false;
                this.isError = true;
                this.savedUnit = null;
            });
        }
    }
}
</script>

<style scoped>

</style>
