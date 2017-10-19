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
    }
};