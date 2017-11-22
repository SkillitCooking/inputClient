'use strict';

import mutation from '../mutation-types';
import {TIMEOUT} from '../constants';
import {mealPlans as mealPlansAPI} from '../../api';

const state = {
    //will be for just a given selected user...
    //so will be empty unless a user is selected, and will be reloaded when another is
    mealPlans: [],
    mealPlansAPIError: {
        isError: false
    }
};

const actions = {
    deleteMealPlan({ commit }, mealPlanId) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.MEAL_PLAN.SET_API_ERROR, {isError: false});
            let deletedMealPlan = await mealPlansAPI.deleteMealPlan(mealPlanId);
            if(deletedMealPlan.hasOwnProperty('error')) {
                commit(mutation.MEAL_PLAN.SET_API_ERROR, {isError: true, error: deletedMealPlan.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.MEAL_PLAN.REMOVE_MEAL_PLAN, deletedMealPlan.id);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(deletedMealPlan.title);
                }, TIMEOUT);
            }
        })
    },
    editMealPlan({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.MEAL_PLAN.SET_API_ERROR, {isError: false});
            let editedMealPlan = await mealPlansAPI.editMealPlan(payload.mealPlan, payload.recipesToRemove, payload.ingredientsToRemove);
            if(editedMealPlan.hasOwnProperty('error')) {
                commit(mutation.MEAL_PLAN.SET_API_ERROR, {isError: true, error: editedMealPlan.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.MEAL_PLAN.EDIT_MEAL_PLAN, editedMealPlan);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(editedMealPlan.title);
                }, TIMEOUT);
            }
        });
    },
    saveMealPlan({ commit }, mealPlan) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.MEAL_PLAN.SET_API_ERROR, {isError: false});
            let savedMealPlan = await mealPlansAPI.saveMealPlan(mealPlan);
            if(!savedMealPlan || savedMealPlan.hasOwnProperty('error')) {
                if(!savedMealPlan) {
                    savedMealPlan = {
                        error: "Server Error"
                    };
                }
                commit(mutation.MEAL_PLAN.SET_API_ERROR, {isError: true, error: savedMealPlan.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(savedMealPlan.title);
                }, TIMEOUT);
            }
        });
    },
    fetchMealPlans({ commit }, userId) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.MEAL_PLAN.SET_API_ERROR, {isError: false});
            let fetchedMealPlans = await mealPlansAPI.fetchMealPlans(userId);
            if(!fetchedMealPlans || fetchedMealPlans.hasOwnProperty('error')) {
                if(!fetchedMealPlans) {
                    fetchedMealPlans = {
                        error: "Server Error"
                    };
                }
                commit(mutation.MEAL_PLAN.SET_API_ERROR, {isError: true, error: savedMealPlan.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.MEAL_PLAN.SET_MEAL_PLANS, fetchedMealPlans);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve();
                });
            }
        });
    }
};

const mutations = {
    [mutation.MEAL_PLAN.SET_API_ERROR] (state, error) {
        state.mealPlansAPIError = error;
    },
    [mutation.MEAL_PLAN.SET_MEAL_PLANS] (state, mealPlans) {
        state.mealPlans = mealPlans;
    },
    [mutation.MEAL_PLAN.EDIT_MEAL_PLAN] (state, mealPlan) {
        let index = state.mealPlans.findIndex(mp => mp.id === mealPlan.id);
        state.mealPlans.splice(index, 1, mealPlan);
    },
    [mutation.MEAL_PLAN.REMOVE_MEAL_PLAN] (state, mealPlanId) {
        let index = state.mealPlans.findIndex(mp => mp.id === mealPlanId);
        state.mealPlans.splice(index, 1);
    }
};

export default {
    state,
    mutations,
    actions
}