'use strict';

import mutation from '../mutation-types';
import {users as userAPI} from '../../api';

const state = {
    user: {}
};

const mutations = {
    [mutation.USER.SET] (state, user) {
        state.user = user;
    },
    [mutation.USER.SET_TOKEN] (state, token) {
        state.user = {...state.user, token: token};
    }
};

const actions = {};

export default {
    state,
    mutations,
    actions
}