'use strict';

import mutation from '../mutation-types';
import {TIMEOUT} from '../constants';
import {ingredients as ingredientsAPI} from '../../api';

const state = {
    ingredients: [],
    ingredientsAPIError: {
        isError: false
    },
    ingredientsLoaded: false
};

const mutations = {
    [mutation.INGREDIENT.ADD_INGREDIENT] (state, ingredient) {
        state.ingredients.push(ingredient);
    },
    [mutation.INGREDIENT.EDIT_INGREDIENT] (state, editIngredient) {
        let index = state.ingredients.findIndex(i => i.id === editIngredient.id);
        state.ingredients.splice(index, 1, editIngredient);
    },
    [mutation.INGREDIENT.REMOVE_INGREDIENT] (state, ingredientId) {
        let index = state.ingredients.findIndex(i => i.id === ingredientId);
        state.ingredients.splice(index, 1);
    },
    [mutation.INGREDIENT.INGREDIENTS_LOADED] (state) {
        state.ingredientsLoaded = true;
    },
    [mutation.INGREDIENT.SET_API_ERROR] (state, error) {
        state.ingredientsAPIError = error;
    },
    [mutation.INGREDIENT.SET_INGREDIENTS] (state, ingredients) {
        state.ingredients = ingredients;
    }
};

const actions = {
    deleteIngredient({ commit }, ingredientId) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.INGREDIENT.SET_API_ERROR, {isError: false});
            let deletedIngredient = await ingredientsAPI.deleteIngredient(ingredientId);
            if(deletedIngredient.hasOwnProperty('error')) {
                commit(mutation.INGREDIENT.SET_API_ERROR, {isError: true, error: deletedIngredient.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.INGREDIENT.REMOVE_INGREDIENT, deletedIngredient.id);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(deletedIngredient.nameSingular + ':::' + editedIngredient.storeKeepingName);
                }, TIMEOUT);
            }
        });
    },
    editIngredient({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.INGREDIENT.SET_API_ERROR, {isError: false});
            //can I use object destructuring here?
            let editedIngredient = await ingredientsAPI.editIngredient(payload.ingredient, payload.composingToRemove, payload.composingToEdit, payload.tagsToRemove);
            if(editedIngredient.hasOwnProperty('error')) {
                commit(mutation.INGREDIENT.SET_API_ERROR, {isError: true, error: editedIngredient.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.INGREDIENT.EDIT_INGREDIENT, editedIngredient);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(editedIngredient.nameSingular + ':::' + editedIngredient.storeKeepingName);
                }, TIMEOUT);
            }
        });
    },
    fetchIngredients({ commit }) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.INGREDIENT.SET_API_ERROR, {isError: true});
            if(!state.ingredientsLoaded) {
                let fetchedIngredients = await ingredientsAPI.fetchIngredients();
                if(fetchedIngredients.hasOwnProperty('errors')) {
                    commit(mutation.INGREDIENT.SET_API_ERROR, {isError: true, error: fetchedIngredients.error});
                    setTimeout(() => {
                        commit(mutation.LOADING.STOP);
                        resolve();
                    }, TIMEOUT);
                } else {
                    commit(mutation.INGREDIENT.INGREDIENTS_LOADED);
                    commit(mutation.INGREDIENT.SET_INGREDIENTS, fetchedIngredients);
                    setTimeout(() => {
                        commit(mutation.LOADING.STOP);
                        resolve();
                    }, TIMEOUT);
                }
            } else {
                commit(mutation.LOADING.STOP);
                resolve();
            }
        })
    },
    saveIngredient({ commit }, ingredient) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.INGREDIENT.SET_API_ERROR, {isError: false});
            let fetchedIngredient = await ingredientsAPI.saveIngredient(ingredient);
            if(fetchedIngredient.hasOwnProperty('error')) {
                commit(mutation.INGREDIENT.SET_API_ERROR, {isError: true, error: fetchedIngredient.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.INGREDIENT.ADD_INGREDIENT, fetchedIngredient);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(fetchedIngredient.nameSingular + ':::' + fetchedIngredient.storeKeepingName);
                }, TIMEOUT);
            }
        });
    }
};

export default {
    state,
    actions,
    mutations
}