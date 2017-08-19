<template>
    <div>
        <circle9 v-if="loading"></circle9>
        <div v-show="!loading">
            <p v-if="editSuccess" class="has-text-success">You {{editAction}} {{editedSeasoning}} successfully!</p>
            <p v-if="isError" class="has-text-danger">There was an error</p>
            <div class="field">
                <label class="label">Select Seasoning</label>
                <div class="control">
                    <div class="select">
                        <select
                            ref="seasoningsSelect"
                            v-on:change="selectSeasoning"
                            v-model="selected">
                            <option value="">Select Seasoning...</option>
                            <option v-for="seasoning in seasonings"
                                :key="seasoning.id"
                                :value="seasoning">
                                {{seasoning.name}}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div v-if="selectedSeasoning">
                <div class="field">
                    <label class="label">Name</label>
                    <div class="control">
                        <input v-validate="'required'" name="name" type="text" class="input" placeholder="Seasoning Name" v-model="selectedSeasoning.name">
                    </div>
                    <p v-show="errors.has('name')" class="help is-danger">Required</p>
                </div>
                <div class="field">
                    <div class="control">
                        <label class="checkbox">
                            <input type="checkbox" v-model="selectedSeasoning.isComposite">
                        </label>
                    </div>
                </div>
                <item-select v-if="selectedSeasoning.isComposite" :items="selectedSeasonings" :can-be-optional="false"></item-select>
            </div>
            <div class="field is-grouped">
                <div class="control">
                    <button v-on:click="save()" class="button is-info">Save Changes</button>
                </div>
                <div class="control">
                    <button v-on:click="del()" class="button is-danger">Delete Seasoning</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Circle9 from 'vue-loading-spinner/src/components/Circle9';
import ItemSelect from '../lib/ItemSelect';

export default {
  components: {
      Circle9,
      ItemSelect
  },
  data: function() {
      return {
        editSuccess: false,
        isError: false,
        selectedSeasoning: null,
        selected: '',
        selectedSeasonings: this.$store.state.Seasonings.seasonings.map(s => ({
            selected: false,
            name: s.name,
            id: s.id
        }))
      };
  },
  computed: {
      loading() {
          return this.$store.state.Loading.loading;
      },
      seasonings() {
          return this.$store.state.Seasonings.seasonings;
      }
  },
  methods: {
      save() {
        let removeCompSeasonings = [];
        let seasoning = {
            id: this.selectedSeasoning.id,
            name: this.selectedSeasoning.name,
            isComposite: this.selectedSeasoning.isComposite,
            composingSeasonings: []
        };
        if(seasoning.isComposite) {
            this.selectedSeasonings.forEach(s => {
                let selectedChild = this.selectedSeasoning.childSeasonings.find(cs => cs.id === s.id);
                if(s.selected) {
                    if(!selectedChild) {
                        seasoning.composingSeasonings.push(s.id);
                    }
                } else {
                    if(selectedChild) {
                        removeCompSeasonings.push(selectedChild.compSeaId);
                    }
                }
            });
        } else {
            this.selectedSeasoning.childSeasonings.forEach(cs => {
                removeCompSeasonings.push(cs.compSeaId);
            });
        }
        this.$store.dispatch('editSeasoning', {
            seasoning,
            removeCompSeasonings
        }).then((editedSeasoning) => {
            this.editSuccess = true;
            this.isError = false;
            this.editAction = 'edited';
            this.editedSeasoning = editedSeasoning;
        })
        .catch(() => {
            this.editSuccess = false;
            this.isError = true;
        })
        .then(() => {
            this.selectedSeasoning = null;
            this.selected = '';
            this.$refs["seasoningsSelect"].value = '';
            this.selectedSeasonings = this.seasonings.map(s => ({
                selected: false,
                name: s.name,
                id: s.id
            }))
        });
      },
      del() {
        this.$store.dispatch('deleteSeasoning', this.selectedSeasoning.id)
            .then((deletedSeasoning) => {
                this.editSuccess = true;
                this.editError = false;
                this.editAction = 'deleted';
                this.editedSeasoning = deletedSeasoning;
            })
            .catch(() => {
                this.editSuccess = false;
                this.isError = true;
            })
            .then(() => {
                this.selected = '';
                this.selectedSeasoning = null;
                this.$refs["seasoningsSelect"].value = '';
                this.selectedSeasonings = this.seasonings.map(s => ({
                    selected: false,
                    name: s.name,
                    id: s.id
                }))
            });
      },
      selectSeasoning() {
          if(!this.selected) {
              this.selectedSeasoning = null;
          } else {
              this.selectedSeasoning = Object.assign({}, this.selected);
              this.selectedSeasonings.forEach(s => {
                  if(this.selectedSeasoning.childSeasonings.some(cs => cs.id === s.id)) {
                      s.selected = true;
                  } else {
                      s.selected = false;
                  }
              })
          }
      }
  }
}
</script>
    
<style scoped>

</style>
