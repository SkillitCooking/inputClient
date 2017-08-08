'use strict';

import mutation from '../mutation-types';
import {users as userAPI} from '../../api';
import router from '../../router';

const state = {
    user: {
        username: 'fake name',
        email: 'fake@demo.false'
    },
    loginError: {
        isError: false
    }
};

const mutations = {
    [mutation.USER.SET] (state, user) {
        state.user = user;
    },
    [mutation.USER.SET_TOKEN] (state, token) {
        state.user = {...state.user, token: token};
    },
    [mutation.USER.SET_LOGIN_ERROR] (state, error) {
        state.loginError = error;
    }
};

const actions = {
    async login({ commit }, user) {
        //TODO -> signal bad login -> will need response handling for that
        commit(mutation.LOADING.START);
        commit(mutation.USER.SET_LOGIN_ERROR, {isError: false});
        let fetchedUser = await userAPI.login(user.username, user.password);
        if(fetchedUser.hasOwnProperty('error')) {
            commit(mutation.USER.SET_LOGIN_ERROR, {isError: true, error: fetchedUser.error});
            setTimeout(() => {
                commit(mutation.LOADING.STOP);
            }, 750);
        } else {
            commit(mutation.USER.SET, fetchedUser);
            setTimeout(() => {
                commit(mutation.LOADING.STOP);
                router.push('/');
            }, 750);
        }
    }
};

const getters = {
    isAuthorized: () => {
        return state.user.token && state.user.id ? true : false;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}