<template>
    <div>
        <jawn v-if="loading"></jawn>
        <div v-if="!loading">
            <p v-if="saveSuccess" class="has-text-success">You saved {{savedRecipe}} succesfully!</p>
            <p v-if="isError" class="has-text-danger">There was an error</p>
            <div class="field">
                <label class="label">Title</label>
                <div class="control">
                    <input v-model="inputTitle" v-validate="'required'" name="title" class="input" type="text" placeholder="Input Title">
                </div>
                <p v-show="errors.has('title')" class="help is-danger">Required</p>
            </div>
            <div class="field">
                <label class="label">Description</label>
                <div class="control">
                    <textarea v-validate="'required'" name="description" class="textarea" rows="3" v-model="inputDescription"></textarea>
                </div>
                <p v-show="errors.has('description')" class="help is-danger">Required</p>
            </div>
            <div class="field">
                <label class="label">Main Image Url</label>
                <div class="control">
                    <input type="text" v-validate="'required|url'" name="main-image" class="input" placeholder="Input Main Image Url" v-model="inputMainImageUrl">
                </div>
                <p v-show="errors.has('main-image')" class="help is-danger">Required and must be a url</p>
            </div>
            <div class="field">
                <label class="label">Select Ingredients</label>
                <ingredient-selection :selected-ingredients="selectedIngredients" :recipe-ingredients="inputRecipeIngredients"></ingredient-selection>
            </div>
            <div class="field">
                <label class="label">Select Seasonings</label>
                <item-select :items="selectedSeasonings" :can-be-optional="false"></item-select>
            </div>
            <div class="field">
                <label class="label">Input Steps</label>
                <steps :steps="inputSteps"></steps>
            </div>
            <div class="field">
                <label class="label">Select Tags</label>
                <item-select :items="selectedTags" :can-be-optional="false"></item-select>
            </div>
            <div class="field">
                <div class="control">
                    <button v-on:click="save()" class="button is-primary">Save</button>
                </div>
            </div>
            <h5 class="title is-5">Current Recipes</h5>
            <div class="tags">
                <span class="tag" v-for="recipe in recipes" :key="recipe.id">{{recipe.title}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import Jawn from 'vue-loading-spinner/src/components/Jawn';
import IngredientSelection from './IngredientSelection';
import ItemSelect from '../lib/ItemSelect';
import Steps from './Steps';

export default {
    components: {
        Jawn,
        IngredientSelection,
        ItemSelect,
        Steps
    },
    data: function() {
        return {
            saveSuccess: false,
            isError: false,
            inputTitle: '',
            inputDescription: '',
            inputMainImageUrl: '',
            inputRecipeIngredients: [],
            inputSteps: [],
            selectedSeasonings: this.$store.state.Seasonings.seasonings.map(s => ({
                selected: false,
                name: s.name,
                id: s.id
            })),
            selectedTags: this.$store.state.Tags.tags.map(t => ({
                selected: false,
                name: t.name,
                id: t.id
            })),
            selectedIngredients: this.$store.state.Ingredients.ingredients.map(i => ({
                selected: false,
                id: i.id,
                nameSingular: i.nameSingular,
                servingSize: i.servingSize
            }))
        };
    },
    computed: {
        loading() {
            return this.$store.state.Loading.loading;
        },
        recipes() {
            return this.$store.state.Recipes.recipes;
        }
    },
    methods: {
        save() {
            let recipe = {
                title: this.inputTitle,
                description: this.inputDescription,
                mainImageUrl: this.inputMainImageUrl,
                ingredients: this.inputRecipeIngredients.map(i => ({
                    ingredient: i.id,
                    isFrozen: i.isFrozen,
                    proportion: i.proportion
                })),
                seasonings: this.selectedSeasonings.filter(s => s.selected).map(s => s.id),
                tags: this.selectedTags.filter(t => t.selected).map(t => t.id),
                steps: this.inputSteps
            };
            this.$store.dispatch('saveRecipe', recipe)
                .then((savedRecipe) => {
                    this.saveSuccess = true;
                    this.isError = false;
                    this.savedRecipe = savedRecipe;
                    this.inputTitle= '';
                    this.inputDescription = '';
                    this.inputMainImageUrl = '';
                    this.inputRecipeIngredients = [],
                    this.inputSteps = [];
                    this.selectedSeasonings.forEach(s => {
                        s.selected = false;
                    });
                    this.selectedTags.forEach(t => {
                        t.selected = false;
                    });
                    this.selectedIngredients.forEach(i => {
                        i.selected = false;
                    })
                })
                .catch(() => {
                    this.saveSuccess = false;
                    this.isError = false;
                    this.savedRecipe = null;
                });
        }
    }
}
</script>

<style scoped>
  
</style>
