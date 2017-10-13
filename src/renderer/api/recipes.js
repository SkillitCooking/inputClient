'use strict';

import axios from 'axios';
import {handleError} from '../lib/errors';

async function saveRecipe(recipe) {
    try {
        let res = await axios.post('/recipes', {
            recipe
        });
        return res.data.data;
    } catch (e) {
        handleError(e);
    }
}

async function deleteRecipe(recipeId) {
    try {
        let res = await axios.delete('/recipes/' + recipeId);
        return res.data.data[0];
    } catch(e) {
        handleError(e);
    }
}

async function editRecipe(recipe, stepsToRemove, stepsToUpdate, recipeIngredientsToRemove, recipeIngredientsToUpdate, seasoningsToRemove, tagsToRemove) {
    try {
        let res = await axios.put('/recipes/' + recipe.id, {
            recipe,
            stepsToRemove,
            stepsToUpdate,
            recipeIngredientsToRemove,
            recipeIngredientsToUpdate,
            seasoningsToRemove,
            tagsToRemove
        });
        return res.data.data;
    } catch(e) {
        handleError(e);
    }
}

async function fetchRecipes(ids = []) {
    try {
        let res = await axios.post('recipes/getRecipes', {
            ids
        });        
        return res.data.data;
    } catch (e) {
        handleError(e);
    }
}

export default {
    saveRecipe,
    deleteRecipe,
    editRecipe,
    fetchRecipes
};