<template>
    <div>
        <circle3 v-if="loading"></circle3>
        <div v-if="!loading">
            <p v-if="editSuccess" class="has-text-success">You {{editAction}} {{editedIngredient}} successfully!</p>
            <p v-if="isError" class="has-text-danger">There was an error</p>
            <div class="field">
                <label class="label">Select Ingredient</label>
                <div class="select">
                    <select
                        ref="ingredientsSelect"
                        v-on:change="selectIngredient"
                        v-model="selected">
                        <option value="">Select Ingredient...</option>
                        <option v-for="ingredient in ingredients"
                            :key="ingredient.id"
                            :value="ingredient">
                            {{ingredient.nameSingular}}
                        </option>
                    </select>
                </div>
            </div>
            <div v-if="selectedIngredient">
                <div class="field">
                    <label class="label">Singular Name</label>
                    <div class="control">
                        <input type="text" v-validate="'required'" name="singular" class="input" placeholder="Singular Name" v-model="selectedIngredient.nameSingular">
                    </div>
                    <p v-show="errors.has('singular')" class="help is-danger">Required</p>
                </div>
                <div class="field">
                    <label class="label">Plural Name</label>
                    <div class="control">
                        <input type="text" class="input" name="plural" v-validate="'required'" placeholder="Plural Name" v-model="selectedIngredient.namePlural">
                    </div>
                    <p v-show="errors.has('plural')" class="help is-danger">Required</p>
                </div>
                <div class="field">
                    <label class="label">Description</label>
                    <div class="control">
                        <textarea class="textarea" placeholder="Description" v-model="selectedIngredient.description"></textarea>
                    </div>
                    <p class="help">Optional</p>
                </div>
                <div class="field">
                    <label class="label">Serving Size</label>
                    <div class="control">
                        <input v-model="selectedIngredient.servingSize" v-validate="'required|numeric'" class="input" type="text" name="serving-size" placeholder="Input Serving Size">
                    </div>
                    <p v-show="errors.has('serving-size')" class="help">Required and must be a number</p>
                </div>
                <div class="field">
                    <label class="label">Select Units</label>
                    <div class="control">
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
                    <div class="control">
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
                <div class="field">
                    <label class="label">Select Tags</label>
                    <div class="tags">
                        <span class="tag"
                            v-for="(tag, index) in tags"
                            :key="tag.id"
                            v-on:click="selectTag(index)"
                            v-bind:class="tagClass(index)">
                            {{tag.name}}</span>
                    </div>
                </div>
                <div class="field">
                    <div class="control">
                        <label class="checkbox">
                            <input type="checkbox" v-model="selectedIngredient.isComposite">
                            Is Composite?
                        </label>
                    </div>
                </div>
                <div class="field" v-if="selectedIngredient.isComposite">
                    <label class="label">Select Composing Ingredients</label>
                    <item-select :items="selectedIngredients" :can-be-optional="true"></item-select>
                </div>
            </div>
            <br>
            <div class="field is-grouped">
                <div class="control">
                    <button v-on:click="save()" class="button is-info">Save Changes</button>
                </div>
                <div class="control">
                    <button v-on:click="del()" class="button is-danger">Delete Ingredient</button>
                </div>
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
  data: function() {
      return {
          editSuccess: false,
          isError: false,
          selectedIngredient: null,
          selected: '',
          selectedIngredients: this.$store.state.Ingredients.ingredients.map(i => ({
              selected: false,
              id: i.id,
              name: i.nameSingular,
              isOptional: false
          })),
          selectedTags: Array(this.$store.state.Tags.tags.length).fill(false)
      };
  },
  computed: {
      loading() {
          return this.$store.state.Loading.loading;
      },
      ingredients() {
          return this.$store.state.Ingredients.ingredients;
      },
      tags() {
          return this.$store.state.Tags.tags;
      },
      units() {
          return this.$store.state.Units.units;
      }
  },
  methods: {
      selectTag(index) {
          this.$set(this.selectedTags[index], 'current', !this.selectedTags[index].current);
      },
      tagClass(index) {
          return this.selectedTags[index].current ?
            {'is-primary': true, 'is-medium': true} :
            {};
      },
      selectIngredient() {
          if(!this.selected) {
              this.selectedIngredient = null;
              this.selectedUnit = '';
              this.selectedCategory = '';
          } else {
              this.selectedTags = this.selectedTags.map(t => ({current: false, original: false}));
              this.selectedIngredient = Object.assign({}, this.selected);
              this.selectedUnit = this.units.find(unit => unit.id === this.selectedIngredient.units.id);
              this.selectedIngredient.tags.forEach(t => {
                  let index = this.tags.findIndex(tag => t.id === tag.id);
                  if(t.type === 'CATEGORY') {
                      this.selectedCategory = this.tags[index];
                      this.originalCategory = t;
                  } else {
                      this.selectedTags[index].current = true;
                      this.selectedTags[index].original = true;
                  }
              });
              this.selectedIngredients.forEach(i => {
                  let child = this.selectedIngredient.childIngredients.find(ci => ci.id === i.id);
                  if(child){
                      i.selected = true;
                      i.isOptional = child.isOptional;
                  } else {
                      i.selected = false;
                  }
              });
          }
      },
      save() {
          let composingToRemove = [];
          let tagsToRemove = [];
          let composingToEdit = [];
          let ingredient = {
              id: this.selectedIngredient.id,
              nameSingular: this.selectedIngredient.nameSingular,
              namePlural: this.selectedIngredient.namePlural,
              description: this.selectedIngredient.description,
              servingSize: this.selectedIngredient.servingSize,
              isComposite: this.selectedIngredient.isComposite,
              units: this.selectedUnit.id,
              tags: [],
              composingIngredients: []
          };
          if(this.selectedCategory.id !== this.originalCategory.id) {
              ingredient.category = this.selectedCategory.id;
              tagsToRemove.push(this.originalCategory.ingTagId);
          }
          this.selectedTags.forEach((t, index) => {
              if(t.original && !t.current) {
                  //remove
                  let removeTag = this.selectedIngredient.tags.find(t => t.id === this.tags[index].id);
                  tagsToRemove.push(removeTag.ingTagId);
              }
              if(!t.original && t.current) {
                  //adds
                  ingredient.tags.push(this.tags[index].id);
              }
          });
          if(ingredient.isComposite) {
              this.selectedIngredients.forEach((i, index) => {
                  let selectedChild = this.selectedIngredient.childIngredients.find(ci => ci.id === i.id);
                  if(i.selected && !selectedChild) {
                      ingredient.composingIngredients.push([i.id, i.isOptional]);
                  }
                  if(!i.selected && selectedChild) {
                      composingToRemove.push(selectedChild.compIngId);
                  }
                  if(i.selected && selectedChild) {
                      if(i.isOptional !== selectedChild.isOptional) {
                          composingToEdit.push({
                              id: selectedChild.compIngId,
                              isOptional: i.isOptional
                          })
                      }
                  }
              });
          } else {
              this.selectedIngredient.childIngredients.forEach(ci => {
                  composingToRemove.push(ci.compIngId);
              });
          }
          this.$store.dispatch('editIngredient', {
              ingredient,
              tagsToRemove,
              composingToRemove,
              composingToEdit
          }).then((editedIngredient) => {
              this.editSuccess = true;
              this.isError = false;
              this.editAction = 'edited';
              this.editedIngredient = editedIngredient;
          })
          .catch(() => {
              this.editSuccess = false;
              this.isError = true;
          })
          .then(() => {
              this.selectedIngredient = null;
              this.selected = '';
              this.$refs["ingredientsSelect"].value = '';
              this.selectedIngredients = this.ingredients.map(i => ({
                  selected: false,
                  isOptional: false,
                  name: i.nameSingular,
                  id: i.id
              }));
          });
      },
      del() {
          this.$store.dispatch('deleteIngredient', this.selectedIngredient.id)
            .then((deletedIngredient) => {
                this.editSuccess = true;
                this.isError = false;
                this.editAction = 'deleted';
                this.editedIngredient = deletedIngredient;
            })
            .catch(() => {
                this.editSuccess = false;
                this.isError = true;
            })
            .then(() => {
                this.selectedIngredient = null;
                this.selected = '';
                this.$refs["ingredientsSelect"].value = '';
                this.selectedIngredients = this.ingredients.map(i => ({
                    selected: false,
                    isOptional: false,
                    name: i.nameSingular,
                    id: i.id
                }));
            })
      }
  }
}
</script>

<style scoped>

</style>
