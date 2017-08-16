<template>
    <div>
        <circle3 v-if="loading"></circle3>
        <div v-show="!loading">
            <p v-if="saveSuccess" class="has-text-success">You saved {{savedIngredient}} successfully!</p>
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
                <label class="label">Description</label>
                <div class="control">
                    <textarea v-model="inputDescription" class="textarea" placeholder="Input Description"></textarea>
                </div>
                <p class="help">Optional</p>
            </div>
            <div class="field">
                <label class="label">Serving Size</label>
                <div class="control">
                    <input v-model="inputServingSize" placeholder="Input Serving Size" class="input" type="text">
                </div>
                <p class="help">Input a Number. Default is 1 if invalid input put in</p>
            </div>
            <div class="field">
                <label class="label">Select Units</label>
                <div class="select">
                    <select
                        ref="unitsSelect"
                        v-model="selectedUnit">
                        <option value="">Select Unit...</option>
                        <option v-for="unit in units"
                            :key="unit.id"
                            :value="unit">
                            {{unit.nameSingular}}
                        </option>
                    </select>
                </div>
            </div>
            <div class="field">
                <label class="label">Select Category</label>
                <div class="select">
                    <select
                        ref="categorySelect"
                        v-model="selectedCategory">
                        <option value="">Select Category...</option>
                        <option v-for="category in tags"
                            :key="category.id"
                            :value="category">
                            {{category.name}}
                        </option>
                    </select>
                </div>
            </div>
            <label class="label">Select Tags</label>
            <!--Is this wrapping sufficient? Necessary?-->
            <div class="tags">
                <span class="tag"
                    v-for="(tag, index) in tags"
                    :key="tag.id"
                    v-on:click="selectTag(index)"
                    v-bind:class="tagClass(index)">
                    {{tag.name}}</span>
            </div>
            <div class="field">
                <div class="control">
                    <label class="checkbox">
                        <input type="checkbox" v-model="inputIsComposite">
                        Is Composite?
                    </label>
                </div>
            </div>
            <div class="field" v-if="inputIsComposite">
                <label class="label">Select Composing Ingredients</label>
                <item-select :items="selectedIngredients" :can-be-optional="true"></item-select>
            </div>
            <div class="field">
                <div class="control">
                    <button v-on:click="save()" class="button is-primary">Save</button>
                </div>
            </div>
            <h5 class="title is-5">Current Ingredients</h5>
            <div class="tags">
                <span class="tag" v-for="ingredient in ingredients" :key="ingredient.id">{{ingredient.nameSingular}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import Circle3 from 'vue-loading-spinner/src/components/Circle3';
import ItemSelect from '../lib/ItemSelect';

export default {
  components: {
      Circle3,
      ItemSelect
  },
  methods: {
      selectTag(index) {
          this.$set(this.selectedTags, index, !this.selectedTags[index]);
      },
      tagClass(index) {
          return this.selectedTags[index] ?
            {'is-primary': true, 'is-medium': true} :
            {};
      },
      save() {
          let ingredient = {
              nameSingular: this.inputNameSingular,
              namePlural: this.inputNamePlural,
              description: this.inputDescription,
              servingSize: this.inputServingSize,
              isComposite: this.inputIsComposite,
              units: this.selectedUnit.id,
              category: this.selectedCategory.id,
              tags: this.selectedTags.filter(t => t).map((t, index) => this.tags[index].id)
          };
          if(ingredient.isComposite) {
              ingredient.composingIngredients = this.selectedIngredients
                .filter(i => i.selected).map(i => [i.id, i.isOptional]);
          }
          this.$store.dispatch('saveIngredient', ingredient)
            .then((savedIngredient) => {
                this.saveSuccess = true;
                this.isError = false;
                this.savedIngredient = savedIngredient;
                this.inputNameSingular = '';
                this.inputNamePlural = '';
                this.inputDescription = '';
                this.inputServingSize = 1;
                this.inputIsComposite = false;
                this.selectedUnit = '';
                this.$refs["unitsSelect"].value = '';
                this.selectedCategory = '';
                this.$refs["categorySelect"].value = '';
                this.selectedTags = Array.from(this.selectedTags.fill(false));
                this.selectedIngredients = this.ingredients.map(i => ({
                    selected: false,
                    isOptional: false,
                    id: i.id,
                    name: i.nameSingular
                }));
            })
            .catch(() => {
                this.saveSuccess = false;
                this.isError = true;
                this.savedIngredient = null;
            })
      }
  },
  data: function() {
      return {
        saveSuccess: false,
        isError: false,
        inputNameSingular: '',
        inputNamePlural: '',
        inputDescription: '',
        inputServingSize: 1,
        inputIsComposite: false,
        selectedUnit: '',
        selectedCategory: '',
        selectedTags: Array(this.$store.state.Tags.tags.length).fill(false),
        selectedIngredients: this.$store.state.Ingredients.ingredients.map(i => ({
            selected: false,
            id: i.id,
            name: i.nameSingular,
            isOptional: false
        }))
      };
  },
  computed: {
      loading() {
          return this.$store.state.Loading.loading;
      },
      tags() {
          return this.$store.state.Tags.tags;
      },
      units() {
          return this.$store.state.Units.units;
      },
      ingredients() {
          return this.$store.state.Ingredients.ingredients;
      }
  }
}
</script>

<style scoped>

</style>
