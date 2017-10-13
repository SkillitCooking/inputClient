'use strict';

import mutation from '../mutation-types';
import {TIMEOUT} from '../constants';
import {users as userAPI} from '../../api';

const state = {
    user: {
        username: 'fake name',
        email: 'fake@demo.false'
    },
    users: [],
    loginError: {
        isError: false
    },
    usersAPIError: {
        isError: false
    },
    usersLoaded: false
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
    },
    [mutation.USER.SET_API_ERROR] (state, error) {
        state.usersAPIError = error;
    },
    [mutation.USER.USERS_LOADED] (state) {
        state.usersLoaded = true;
    },
    [mutation.USER.SET_USERS] (state, users) {
        state.users = users;
    },
    [mutation.USER.ADD_USER] (state, user) {
        state.users.push(user);
    },
    [mutation.USER.EDIT_USER] (state, editUser) {
        let index = state.users.findIndex(u => u.id === editUser.id);
        state.users.splice(index, 1, editUser);
    },
    [mutation.USER.REMOVE_USER] (state, userId) {
        let index = state.users.findIndex(u => u.id === userId);
        state.users.splice(index, 1);
    }
};

const actions = {
    async login({ commit }, user) {
        return new Promise(async (resolve, reject) => {
            //TODO -> signal bad login -> will need response handling for that
            commit(mutation.LOADING.START);
            commit(mutation.USER.SET_LOGIN_ERROR, {isError: false});
            let fetchedUser = await userAPI.login(user.username, user.password);
            if(fetchedUser.hasOwnProperty('error')) {
                commit(mutation.USER.SET_LOGIN_ERROR, {isError: true, error: fetchedUser.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.USER.SET, fetchedUser);
                setTimeout(() => {
                    resolve();
                }, TIMEOUT);
            }
        });
    },
    fetchUsers({ commit }) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.USER.SET_API_ERROR, {isError: false});
            if(!state.usersLoaded) {
                let fetchedUsers = await userAPI.fetchUsers();
                if(fetchedUsers.hasOwnProperty('error')) {
                    commit(mutation.USER.SET_API_ERROR, {isError: true, error: fetchedUsers.error});
                    setTimeout(() => {
                        commit(mutation.LOADING.STOP);
                        resolve();
                    }, TIMEOUT);
                } else {
                    commit(mutation.USER.USERS_LOADED);
                    commit(mutation.USER.SET_USERS, fetchedUsers);
                    setTimeout(() => {
                        commit(mutation.LOADING.STOP);
                        resolve();
                    }, TIMEOUT);
                }
            } else {
                commit(mutation.LOADING.STOP);
                resolve();
            }
        });
    },
    saveUser({commit}, user) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.USER.SET_API_ERROR, {isError: false});
            let fetchedUser = await userAPI.saveUser(user);
            if(fetchedUser.hasOwnProperty('error')) {
                commit(mutation.USER.SET_API_ERROR, {isError: true, error: fetchedUser.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.USER.ADD_USER, fetchedUser);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(fetchedUser.username);
                }, TIMEOUT);
            }
        });
    },
    editUser({commit}, user) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.USER.SET_API_ERROR, {isError: false});
            let editedUser = await userAPI.editUser(user);
            if(editedUser.hasOwnProperty('error')) {
                commit(mutation.USER.SET_API_ERROR, {isError: true, error: editedUser.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.USER.EDIT_USER, editedUser);
            }
        })
    },
    deleteUser({commit}, userId) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.USER.SET_API_ERROR, {isError: false});
            let deletedUser = await userAPI.deleteUser(userId);
            if(deletedUser.hasOwnProperty('error')) {
                commit(mutation.USER.SET_API_ERROR, {isError: true, error: deletedUser.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.USER.REMOVE_USER, deletedUser.id);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(deletedUser.username);
                }, TIMEOUT)
            }
        })
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