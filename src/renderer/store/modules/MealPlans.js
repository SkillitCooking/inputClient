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
    saveMealPlan({ commit }, mealPlan) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.MEAL_PLAN.SET_API_ERROR, {isError: false});
            let savedMealPlan = await mealPlansAPI.saveMealPlan(mealPlan);
            if(savedMealPlan.hasOwnProperty('error')) {
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
    }
};

const mutations = {
    [mutation.MEAL_PLAN.SET_API_ERROR] (state, error) {
        state.mealPlansAPIError = error;
    }
};

export default {
    state,
    mutations,
    actions
}