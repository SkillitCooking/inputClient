'use strict';

import mutation from '../mutation-types';
import {users as userAPI} from '../../api';

const state = {
    user: {
        username: 'fake name',
        email: 'fake@demo.false',
        token: 'fake token'
    }
};

const mutations = {
    [mutation.USER.SET] (state, user) {
        state.user = user;
    },
    [mutation.USER.SET_TOKEN] (state, token) {
        state.user = {...state.user, token: token};
    }
};

const actions = {
    async login({ commit }, user) {
        //TODO -> signal bad login -> will need response handling for that
        let fetchedUser = await userAPI.login(user.username, user.password);
        commit(mutation.USER.SET, fetchedUser);
    }
};

const getters = {
    //have getters for token and username and email?
    //or accessible through state?
    //How the state attributes accessed in Componnet?
    //=>> from within computed property
    isAuthorized: () => {
        return state.user.token ? true : false;
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}