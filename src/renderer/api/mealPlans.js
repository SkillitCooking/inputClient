'use strict';

import axios from 'axios';
import {handleError} from '../lib/errors';

export default {
    async saveMealPlan(mealPlan) {
        try {
            let res = await axios.post('/mealPlans', {
                mealPlan
            });
            return res.data.data;
        } catch(e) {
            handleError(e);
        }
    },
    //will eventually want to paginate this...
    async fetchMealPlans(userId) {
        try {
            let res = await axios.get('/mealPlans/byUser/' + userId);
            return res.data.data;
        } catch (e) {
            handleError(e);
        }
    },
    async editMealPlan(mealPlan, recipesToRemove) {
        try {
            let res = await axios.put('/mealPlans/' + mealPlan.id, {
                mealPlan,
                recipesToRemove
            });
            return res.data.data;
        } catch(e) {
            handleError(e);
        }
    },
    async deleteMealPlan(mealPlanId) {
        try {
            let res = await axios.delete('/mealPlans/' + mealPlanId);
            return res.data.data[0];
        } catch(e) {
            handleError(e);
        }
    }
};