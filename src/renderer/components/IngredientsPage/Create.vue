<template>
    <div>
        <circle3 v-if="loading"></circle3>
        <div v-show="!loading">
            <p v-if="saveSuccess" class="has-text-success">You saved {{savedIngredient}} successfully!</p>
            <p v-if="isError" class="has-text-danger">There was an error</p>
            <div class="field">
                <label class="label">Singular Name</label>
                <div class="control">
                    <input v-validate="'required'" v-model="inputNameSingular" name="singular" class="input" type="text" placeholder="Input Singular Name">
                </div>
                <p v-show="errors.has('singular')" class="help is-danger">This is Required</p>
            </div>
            <div class="field">
                <label class="label">Plural Name</label>
                <div class="control">
                    <input v-validate="'required'" v-model="inputNamePlural" name="plural" class="input" type="text" placeholder="Input Plural Name">
                </div>
                <p v-show="errors.has('plural')" class="help is-danger">This is Required</p>
            </div>
            <div class="field">
                <label class="label">Store Keeping Name</label>
                <div class="control">
                    <input type="text" v-validate="'required'" v-model="inputStoreName" name="storename" placeholder="Input Store Keeping Name" class="input">
                </div>
                <p v-show="errors.has('storename')" class="help is-danger">This is Required</p>
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
                    <input v-model="inputServingSize" v-validate="'required|decimal'" placeholder="Input Serving Size" name="serving-size" class="input" type="text">
                </div>
                <p v-show="!errors.has('serving-size')" class="help">In terms of Units</p>
                <p v-show="errors.has('serving-size')" class="help is-danger">Required, and must be a decimal number</p>
            </div>
            <div class="field">
                <label class="label">Total Size</label>
                <div class="control">
                    <input v-model="inputTotalSize" v-validate="'required|decimal'" placeholder="Input Total Size" name="total-size" class="input" type="text">
                </div>
                <p v-show="!errors.has('total-size')" class="help">In terms of Units</p>
                <p v-show="errors.has('total-size')" class="help is-danger">Required, and must be a decimal number</p>
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
                <label class="label">Total Price</label>
                <div class="control">
                    <input v-model="inputTotalPrice" v-validate="'required|decimal'" placeholder="Input Total Price" name="total-price" class="input" type="text">
                </div>
                <p v-show="errors.has('total-price')" class="help is-danger">Required, and must be a decimal</p>
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
              storeKeepingName: this.inputStoreName,
              description: this.inputDescription,
              servingSize: this.inputServingSize,
              totalSize: this.inputTotalSize,
              estTotalPrice: this.inputTotalPrice,
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
                this.inputStoreName = '';
                this.inputDescription = '';
                this.inputServingSize = 1;
                this.inputTotalSize = 1;
                this.inputTotalPrice = 0;
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
            });
      }
  },
  data: function() {
      return {
        saveSuccess: false,
        isError: false,
        inputNameSingular: '',
        inputNamePlural: '',
        inputStoreName: '',
        inputDescription: '',
        inputServingSize: 1,
        inputTotalSize: 1,
        inputTotalPrice: 0,
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
