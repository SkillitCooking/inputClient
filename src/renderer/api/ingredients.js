'use strict';

import axios from 'axios';
import {handleError} from '../lib/errors';

async function saveIngredient(ingredient) {
    try {
        let res = await axios.post('/ingredients', {
            ingredient
        });
        return res.data.data;
    } catch (e) {
        handleError(e);
    }
}

async function deleteIngredient(ingredientId) {
    try {
        let res = await axios.delete('/ingredients/' + ingredientId);
        return res.data.data[0];
    } catch(e) {
        handleError(e);
    }
}

async function editIngredient(ingredient, composingToRemove, composingToEdit, tagsToRemove) {
    try {
        let res = await axios.put('/ingredients/' + ingredient.id, {
            ingredient,
            composingToRemove,
            composingToEdit,
            tagsToRemove
        });
        return res.data.data;
    } catch (e) {
        handleError(e);
    }
}

async function fetchIngredients(ids = []) {
    try {
        let res = await axios.post('/ingredients/getIngredients', {
            ids
        });
        return res.data.data;
    } catch(e) {
        handleError(e);
    }
}

export default {
    saveIngredient,
    deleteIngredient,
    editIngredient,
    fetchIngredients
};