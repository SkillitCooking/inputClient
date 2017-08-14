<template>
    <div>
        <scale-out v-if="loading"></scale-out>
        <div v-show="!loading">
            <p v-if="editSuccess" class="has-text-success">You {{editAction}} {{editedUnit}} successfully</p>
            <p v-if="isError" class="has-text-danger">There was an error</p>
            <div class="field">
                <label class="label">Select Unit</label>
                <div class="control">
                    <div class="select">
                        <select 
                            ref="unitsSelect"  
                            v-on:change="selectUnit"
                            v-model="selected">
                            <option value="">Select Unit...</option>
                            <option v-for="unit in units"
                                :key="unit.id"
                                :value="unit">
                                {{unit.namePlural}}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div v-if="selectedUnit">
                <div class="field">
                    <label class="label">Singular Name</label>
                    <div class="control">
                        <input v-model="selectedUnit.nameSingular" class="input" type="text" placeholder="Edit Singular Name">
                    </div>
                    <p class="help">Required</p>
                </div>
                <div class="field">
                    <label class="label">Plural Name</label>
                    <div class="control">
                        <input v-model="selectedUnit.namePlural" class="input" type="text" placeholder="Edit Plural Name">
                    </div>
                    <p class="help">Required</p>
                </div>
                <div class="field">
                    <div class="field">
                        <label class="label">Abbreviation</label>
                        <div class="control">
                            <input v-model="selectedUnit.abbreviation" class="input" type="text" placeholder="Edit Abbreviation">
                        </div>
                        <p class="help">Optional</p>
                    </div>
                </div>
            </div>
            <div class="field is-grouped">
                <div class="control">
                    <button v-on:click="save()" class="button is-info">Save Changes</button>
                </div>
                <div class="control">
                    <button v-on:click="del()" class="button is-danger">Delete Unit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ScaleOut from 'vue-loading-spinner/src/components/ScaleOut';

export default {
  components: {
      ScaleOut
  },
  data: function() {
    return {
        editSuccess: false,
        isError: false,
        selectedUnit: null,
        selected: ''
    };
  },
  methods: {
    selectUnit() {
        if(this.selected === "") {
            this.selectedUnit = null;
        } else {
            this.selectedUnit = Object.assign({}, this.selected);
        }
    },
    save() {
        this.$store.dispatch('editUnit', this.selectedUnit)
            .then((editedUnit) => {
                this.editSuccess = true;
                this.isError = false;
                this.editAction = 'edited';
                this.editedUnit = editedUnit;
            })
            .catch(() => {
                this.editSuccess = false;
                this.isError = true;
            })
            .then(() => {
                this.selectedUnit = null;
                this.selected = '';
                this.$refs["unitsSelect"].value = '';
            })
    },
    del() {
        this.$store.dispatch('deleteUnit', this.selectedUnit.id)
            .then((deletedUnit) => {
                this.editSuccess = true;
                this.editError = false;
                this.editAction = 'deleted';
                this.editedUnit = deletedUnit;
            })
            .catch(() => {
                this.editSuccess = false;
                this.isError = true;
            })
            .then(() => {
                this.selected = '';
                this.selectedUnit = null;
                this.$refs["unitsSelect"].value = '';
            })
    }
  },
  computed: {
      units() {
          return this.$store.state.Units.units;
      },
      loading() {
          return this.$store.state.Loading.loading;
      }
  }
}
</script>

<style scoped>

</style>
