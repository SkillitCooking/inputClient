'use strict';

import mutation from '../mutation-types';
import {TIMEOUT} from '../constants';
import {recipes as recipesAPI} from '../../api';

const state = {
    recipes: [],
    recipesAPIError: {
        isError: false
    },
    recipesLoaded: false
};

const actions = {
    deleteRecipe({ commit }, recipeId) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.RECIPE.SET_API_ERROR, {isError: false});
            let deletedRecipe = await recipesAPI.deleteRecipe(recipeId);
            if(deletedRecipe.hasOwnProperty('error')) {
                commit(mutation.RECIPE.SET_API_ERROR, {isError: true, error: deletedRecipe.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.RECIPE.REMOVE_RECIPE, deletedRecipe.id);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(deletedRecipe.title);
                }, TIMEOUT);
            }
        });
    },
    saveRecipe({ commit }, recipe) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.RECIPE.SET_API_ERROR, {isError: false});
            let savedRecipe = await recipesAPI.saveRecipe(recipe);
            if(savedRecipe.hasOwnProperty('error')) {
                commit(mutation.RECIPE.SET_API_ERROR, {isError: true, error: savedRecipe.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.RECIPE.ADD_RECIPE, savedRecipe);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(savedRecipe.title);
                }, TIMEOUT);
            }
        });
    },
    editRecipe({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.RECIPE.SET_API_ERROR, {isError: false});
            let editedRecipe = await recipesAPI.editRecipe(payload.recipe, payload.stepsToRemove, payload.stepsToUpdate, payload.recipeIngredientsToRemove, payload.recipeIngredientsToUpdate, payload.seasoningsToRemove, payload.tagsToRemove);
            if(editedRecipe.hasOwnProperty('error')) {
                commit(mutation.RECIPE.SET_API_ERROR, {isError: true, error: editedRecipe.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.RECIPE.EDIT_RECIPE, editedRecipe);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(editedRecipe.title);
                }, TIMEOUT);
            }
        });
    },
    fetchRecipes({ commit }) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.RECIPE.SET_API_ERROR, {isError: false});
            if(!state.recipesLoaded) {
                let fetchedRecipes = await recipesAPI.fetchRecipes();
                if(fetchedRecipes.hasOwnProperty('error')) {
                    commit(mutation.RECIPE.SET_API_ERROR, {isError: true, error: fetchedRecipes.error});
                    setTimeout(() => {
                        commit(mutation.LOADING.STOP);
                        resolve();
                    }, TIMEOUT);
                } else {
                    commit(mutation.RECIPE.RECIPES_LOADED);
                    commit(mutation.RECIPE.SET_RECIPES, fetchedRecipes);
                    setTimeout(() => {
                        commit(mutation.LOADING.STOP);
                        resolve();
                    }, TIMEOUT);
                }
            } else {
                commit(mutation.LOADING.STOP);
                resolve();
            }
        });
    }
};

const mutations = {
    [mutation.RECIPE.ADD_RECIPE] (state, recipe) {
        state.recipes.push(recipe);
    },
    [mutation.RECIPE.EDIT_RECIPE] (state, editRecipe) {
        let index = state.recipes.findIndex(r => r.id === editRecipe.id);
        state.recipes.splice(index, 1, editRecipe);
    },
    [mutation.RECIPE.RECIPES_LOADED] (state) {
        state.recipesLoaded = true;
    },
    [mutation.RECIPE.REMOVE_RECIPE] (state, recipeId) {
        let index = state.recipes.findIndex(r => r.id === recipeId);
        state.recipes.splice(index, 1);
    },
    [mutation.RECIPE.SET_API_ERROR] (state, error) {
        state.recipesAPIError = error;
    },
    [mutation.RECIPE.SET_RECIPES] (state, recipes) {
        state.recipes = recipes;
    }
};

export default {
    state,
    mutations,
    actions
};