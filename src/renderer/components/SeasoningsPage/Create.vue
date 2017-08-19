<template>
  <div>
      <circle9 v-if="loading"></circle9>
      <div v-show="!loading">
          <p v-if="saveSuccess" class="has-text-success">You saved {{savedSeasoning}} successfully!</p>
          <p v-if="isError" class="has-text-danger">There was an error</p>
          <div class="field">
              <label class="label">Name</label>
              <div class="control">
                  <input v-model="inputName" v-validate="'required'" name="name" class="input" type="text" placeholder="Input Name">
              </div>
              <p v-show="errors.has('name')" class="help is-danger">Required</p>
          </div>
          <div class="field">
              <div class="control">
                  <label class="checkbox">
                      <input type="checkbox" v-model="inputIsComposite">
                      Is Composite?
                  </label>
              </div>
          </div>
          <item-select v-if="inputIsComposite" :items="selectedSeasonings" :can-be-optional="false"></item-select>
          <div class="field">
              <div class="control">
                  <button v-on:click="save()" class="button is-primary">Save</button>
              </div>
          </div>
          <h5 class="title is-5">Current Seasonings</h5>
          <div class="tags">
              <span class="tag" v-for="seasoning in seasonings" :key="seasoning.id">{{ seasoning.name }}</span>
          </div>
      </div>
  </div>
</template>

<script>
import Circle9 from 'vue-loading-spinner/src/components/Circle9'
import ItemSelect from '../lib/ItemSelect';

export default {
  components: {
      Circle9,
      ItemSelect
  },
  data: function() {
      return {
        saveSuccess: false,
        isError: false,
        inputName: '',
        inputIsComposite: false,
        selectedSeasonings: this.$store.state.Seasonings.seasonings.map(s => ({
            selected: false,
            name: s.name,
            id: s.id
        }))
      };
  },
  methods: {
    save() {
        let seasoning = {
            name: this.inputName,
            isComposite: this.inputIsComposite
        };
        if(this.inputIsComposite) {
            seasoning.composingSeasonings = this.selectedSeasonings
                .filter(s => s.selected).map(s => s.id);
        }
        this.$store.dispatch('saveSeasoning', seasoning)
            .then((savedSeasoning) => {
                this.saveSuccess = true;
                this.isError = false;
                this.savedSeasoning = savedSeasoning;
                this.inputIsComposite = false;
                this.inputName = '';
                this.selectedSeasonings = this.seasonings.map(s => ({
                    selected: false,
                    name: s.name,
                    id: s.id
                }));
            })
            .catch(() => {
                this.saveSuccess = false;
                this.isError = true;
                this.savedSeasoning = null;
            })
    }
  },
  computed: {
      loading() {
          return this.$store.state.Loading.loading;
      },
      seasonings() {
          return this.$store.state.Seasonings.seasonings;
      }
  }
}
</script>

<style scoped>

</style>
