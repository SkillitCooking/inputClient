'use strict'

export default Object.freeze({
    USER: {
        SET: 'SET_USER',
        SET_TOKEN: 'SET_TOKEN',
        SET_LOGIN_ERROR: 'SET_LOGIN_ERROR',
        SET_API_ERROR: 'SET_API_ERROR',
        USERS_LOADED: 'USERS_LOADED',
        SET_USERS: 'SET_USERS',
        ADD_USER: 'ADD_USER',
        EDIT_USER: 'EDIT_USER',
        REMOVE_USER: 'REMOVE_USER'
    },
    MEAL_PLAN: {
        ADD_MEAL_PLAN: 'ADD_MEAL_PLAN',
        SET_API_ERROR: 'SET_MEAL_PLAN_API_ERROR',
        REMOVE_MEAL_PLAN: 'REMOVE_MEAL_PLAN',
        EDIT_MEAL_PLAN: 'EDIT_MEAL_PLAN',
        SET_MEAL_PLANS: 'SET_MEAL_PLANS',
        FETCH_MEAL_PLANS: 'FETCH_MEAL_PLANS',
        MEAL_PLANS_LOADED: 'MEAL_PLANS_LOADED'
    },
    LOADING: {
        START: 'LOADING_START',
        STOP: 'LOADING_STOP'
    },
    TAG: {
        ADD_TAG: 'ADD_TAG',
        REMOVE_TAG: 'REMOVE_TAG',
        EDIT_TAG: 'EDIT_TAG',
        SET_API_ERROR: 'SET_TAG_API_ERR',
        SET_TAGS: 'SET_TAGS',
        TAGS_LOADED: 'TAGS_LOADED'
    },
    UNIT: {
        ADD_UNIT: 'ADD_UNIT',
        REMOVE_UNIT: 'REMOVE_UNIT',
        EDIT_UNIT: 'EDIT_UNIT',
        SET_API_ERROR: 'SET_UNIT_API_ERR',
        UNITS_LOADED: 'UNITS_LOADED',
        SET_UNITS: 'SET_UNITS'
    },
    SEASONING: {
        ADD_SEASONING: 'ADD_SEASONING',
        REMOVE_SEASONING: 'REMOVE_SEASONING',
        EDIT_SEASONING: 'EDIT_SEASONING',
        SET_API_ERROR: 'SET_SEASONING_API_ERROR',
        SEASONINGS_LOADED: 'SEASONINGS_LOADED',
        SET_SEASONINGS: 'SET_SEASONINGS'
    },
    INGREDIENT: {
        ADD_INGREDIENT: 'ADD_INGREDIENT',
        REMOVE_INGREDIENT: 'REMOVE_INGREDIENT',
        EDIT_INGREDIENT: 'EDIT_INGREDIENT',
        SET_API_ERROR: 'SET_INGREDIENT_API_ERROR',
        INGREDIENTS_LOADED: 'INGREDIENTS_LOADED',
        SET_INGREDIENTS: 'SET_INGREDIENTS'
    },
    RECIPE: {
        ADD_RECIPE: 'ADD_RECIPE',
        REMOVE_RECIPE: 'REMOVE_RECIPE',
        EDIT_RECIPE: 'EDIT_RECIPE',
        SET_API_ERROR: 'SET_API_RECIPE_ERROR',
        RECIPES_LOADED: 'RECIPES_LOADED',
        SET_RECIPES: 'SET_RECIPES'
    }
});