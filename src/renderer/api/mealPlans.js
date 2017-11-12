'use strict';

import axios from 'axios';
import {handleError} from '../lib/errors';

export default {
    async saveMealPlan(mealPlan) {
        try {
            let res = await axios.post('/mealPlans', {
                mealPlan
            });
            if(res.error) {
                handleError(e);
                return res;
            }
            return res.data.data;
        } catch(e) {
            handleError(e);
        }
    },
    //will eventually want to paginate this...
    async fetchMealPlans(userId) {
        try {
            let res = await axios.get('/mealPlans/byUser/' + userId);
            if(res.error) {
                handleError(e);
                return res;
            }
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
            if(res.error) {
                handleError(e);
                return res;
            }
            return res.data.data;
        } catch(e) {
            handleError(e);
        }
    },
    async deleteMealPlan(mealPlanId) {
        try {
            let res = await axios.delete('/mealPlans/' + mealPlanId);
            if(res.error) {
                handleError(e);
                return res;
            }
            return res.data.data[0];
        } catch(e) {
            handleError(e);
        }
    }
};