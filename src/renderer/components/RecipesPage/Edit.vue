<template>
    <div>
        <jawn v-if="loading"></jawn>
        <div v-if="!loading">
            <p v-if="editSuccess" class="has-text-success">You {{editAction}} {{editedRecipe}} successfully!</p>
            <p v-if="isError" class="has-text-danger">There was an Error</p>
            <div class="field">
                <div class="select">
                    <select
                        ref="recipesSelect"
                        v-on:change="selectRecipe"
                        v-model="selected">
                        <option value="">Select Recipe...</option>
                        <option v-for="recipe in recipes"
                            :key="recipe.id"
                            :value="recipe">
                            {{recipe.title}}
                        </option>
                    </select>
                </div>
            </div>
            <div v-if="selectedRecipe">
                <div class="field">
                    <label class="label">Title</label>
                    <div class="control">
                        <input v-model="selectedRecipe.title" v-validate="'required'" name="title" class="input" type="text" placeholder="Input Title">
                    </div>
                    <p v-show="errors.has('title')" class="help is-danger">Required</p>
                </div>
                <div class="field">
                    <label class="label">Description</label>
                    <div class="control">
                        <textarea v-model="selectedRecipe.description" v-validate="'required'" name="description" class="textarea" rows="3" placeholder="Input Description"></textarea>
                    </div>
                    <p v-show="errors.has('description')" class="help is-danger">Required</p>
                </div>
                <div class="field">
                    <label class="label">Main Image Url</label>
                    <div class="control">
                        <input v-model="selectedRecipe.mainImageUrl" v-validate="'required|url'" name="main-image" type="text" class="input" placeholder="Input Main Image Url">
                    </div>
                    <p v-show="errors.has('main-image')" class="help is-danger">Required and must be a valid URL</p>
                </div>
                <div class="field">
                    <label class="label">Select Ingredients</label>
                    <!--how to ensure initial congruence between selection and list?-->
                    <ingredient-selection :selected-ingredients="selectedIngredients" :recipe-ingredients="selectedRecipe.ingredients"></ingredient-selection>
                </div>
                <div class="field">
                    <label class="label">Select Seasonings</label>
                    <item-select :items="selectedSeasonings" :can-be-optional="false"></item-select>
                </div>
                <div class="field">
                    <label class="label">Input Steps</label>
                    <steps :steps="selectedRecipe.steps"></steps>
                </div>
                <div class="field">
                    <label class="label">Select Tags</label>
                    <item-select :items="selectedTags" :can-be-optional="false"></item-select>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <button v-on:click="save()" class="button is-info">Save Changes</button>
                    </div>
                    <div class="control">
                        <button v-on:click="del()" class="button is-danger">Delete Recipe</button>
                    </div>
                </div>
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
            editSuccess: false,
            isError: false,
            selectedRecipe: null,
            selected: '',
            selectedSeasonings: this.$store.state.Seasonings.seasonings.map(s => ({
                id: s.id,
                name: s.name,
                selected: false
            })),
            selectedTags: this.$store.state.Tags.tags.map(t => ({
                id: t.id,
                name: t.name,
                selected: false
            })),
            selectedIngredients: this.$store.state.Ingredients.ingredients.map(i => ({
                id: i.id,
                nameSingular: i.nameSingular,
                selected: false,
                servingSize: i.servingSize
            }))
        };
    },
    methods: {
        selectRecipe() {
            if(!this.selected) {
                this.selectedRecipe = null;
            } else {
                //I think I need to nestingly assign steps in order to avoid reference error with
                //what's directly in the state...
                this.selectedRecipe = JSON.parse(JSON.stringify(this.selected));
                this.selectedRecipe.steps.forEach(s => {
                    s.tags.forEach(t => {
                        t.use = true;
                    });
                });
                this.selectedRecipe.steps.sort((stepA, stepB) => {
                    return stepA.order - stepB.order;
                });
                this.selectedSeasonings.forEach(s => {
                    if(this.selected.seasonings.find(ss => ss.id === s.id)) {
                        s.selected = true;
                    } else {
                        s.selected = false;
                    }
                });
                this.selectedTags.forEach(t => {
                    if(this.selected.tags.find(st => st.id === t.id)) {
                        t.selected = true;
                    } else {
                        t.selected = false;
                    }
                });
                this.selectedIngredients.forEach(i => {
                    if(this.selected.ingredients.find(si => si.id === i.id)) {
                        i.selected = true;
                    } else {
                        i.selected = false;
                    }
                });
            }
        },
        save() {
            let stepsToRemove = [];
            let stepsToUpdate = [];
            let recipeIngredientsToRemove = [];
            let recipeIngredientsToUpdate = [];
            let seasoningsToRemove = [];
            let tagsToRemove = [];
            let recipe = {
                id: this.selectedRecipe.id,
                title: this.selectedRecipe.title,
                description: this.selectedRecipe.description,
                mainImageUrl: this.selectedRecipe.mainImageUrl,
                seasonings: [],
                tags: [],
                ingredients: [],
                steps: []
            };
            //handle seasonings
            this.selectedSeasonings.forEach(ss => {
                if(ss.selected) {
                    let index = this.selectedRecipe.seasonings.findIndex(s => s.id === ss.id)
                    if(index !== -1) {
                        this.selectedRecipe.seasonings.splice(index, 1);
                    } else {
                        recipe.seasonings.push(ss.id);
                    }
                }
            });
            seasoningsToRemove.push(...this.selectedRecipe.seasonings.map(s => s.recipeSeaId));
            //handle tags
            this.selectedTags.forEach(st => {
                if(st.selected) {
                    let index = this.selectedRecipe.tags.findIndex(t => t.id === st.id);
                    if(index !== -1) {
                        this.selectedRecipe.tags.splice(index, 1);
                    } else {
                        recipe.tags.push(st.id);
                    }
                }
            });
            tagsToRemove.push(...this.selectedRecipe.tags.map(t => t.recipeTagId));
            //handle ingredients
            this.selected.ingredients.forEach(si => {
                //every si will have a recipeIngId
                let index = this.selectedRecipe.ingredients.findIndex(i => i.recipeIngId === si.recipeIngId);
                if(index !== -1) {
                    //check for updating needed
                    if(this.selectedRecipe.ingredients[index].proportion !== si.proportion || this.selectedRecipe.ingredients[index].isFrozen !== si.isFrozen) {
                        recipeIngredientsToUpdate.push({
                            id: this.selectedRecipe.ingredients[index].recipeIngId,
                            isFrozen: this.selectedRecipe.ingredients[index].isFrozen,
                            proportion: this.selectedRecipe.ingredients[index].proportion
                        });
                    }
                    this.selectedIngredients.splice(index, 1);
                } else {
                    recipeIngredientsToRemove.push(si.recipeIngId);
                }
                recipe.ingredients.push(...this.selectedRecipe.ingredients.filter(i => !i.recipeIngId).map(i => ({
                    ingredient: i.id,
                    isFrozen: i.isFrozen,
                    proportion: i.proportion
                })));
            })
            //handle steps - selectedRecipe.steps is being adjusted
            //don't forget to handle tags (and tagsToRemove) for updated steps
            this.selected.steps.forEach(ss => {
                let index = this.selectedRecipe.steps.findIndex(s => s.id === ss.id);
                if(index !== -1) {
                    //check for updating - order, text, tags
                    let stepToUpdate = {};
                    if(this.selectedRecipe.steps[index].order !== ss.order || this.selectedRecipe.steps[index].text !== ss.text) {
                        stepToUpdate = {
                            id: ss.id,
                            order: this.selectedRecipe.steps[index].order,
                            text: this.selectedRecipe.steps[index].text
                        };
                    }
                    //tags - look for .use == false and typeof string
                    this.selectedRecipe.steps[index].tags.forEach(t => {
                        if(typeof t === 'string') {
                            stepToUpdate.id = ss.id;
                            if(!stepToUpdate.tags) {
                                stepToUpdate.tags = [];
                            }
                            stepToUpdate.tags.push(t);
                        } else if(!t.use) {
                            stepToUpdate.id = ss.id;
                            if(!stepToUpdate.tagsToRemove) {
                                stepToUpdate.tagsToRemove = [];
                            }
                            stepToUpdate.tagsToRemove.push(t.stepTagId);
                        }
                    });
                    if(stepToUpdate.id) {
                        stepsToUpdate.push(stepToUpdate);
                    }
                } else {
                    //then remove step
                    stepsToRemove.push(ss.id);
                }
            });
            //filter on lack of id property on selectedRecipe.steps
            recipe.steps.push(...this.selectedRecipe.steps.filter(s => !s.id));
            this.$store.dispatch('editRecipe', {
                recipe,
                stepsToRemove,
                stepsToUpdate,
                recipeIngredientsToRemove,
                recipeIngredientsToUpdate,
                tagsToRemove,
                seasoningsToRemove
            })
            .then((editedRecipe) => {
                this.editSuccess = true;
                this.isError = false;
                this.editAction = 'edited';
                this.editedRecipe = editedRecipe;
            })
            .catch(() => {
                this.editSuccess = false;
                this.isError = true;
            })
            .then(() => {
                this.selectedRecipe = null;
                this.selected = '';
                this.$refs["recipesSelect"].value = '';
            });
        },
        del() {
            this.$store.dispatch('deleteRecipe', this.selectedRecipe.id)
                .then((deletedRecipe) => {
                    this.editSuccess = true;
                    this.isError = false;
                    this.editAction = 'deleted';
                    this.editedRecipe = deletedRecipe;
                })
                .catch(() => {
                    this.editSuccess = false;
                    this.isError = true;
                })
                .then(() => {
                    this.selectedRecipe = null;
                    this.selected = '';
                    this.$refs["recipesSelect"].value = '';
                });
        }
    },
    computed: {
        loading() {
            return this.$store.state.Loading.loading;
        },
        recipes() {
            return this.$store.state.Recipes.recipes;
        },
        ingredients() {
            return this.$store.state.Ingredients.ingredients;
        }
    }
}
</script>

<style scoped>
  
</style>
