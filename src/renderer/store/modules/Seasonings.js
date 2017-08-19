'use strict';

import mutation from '../mutation-types';
import {TIMEOUT} from '../constants';
import {seasonings as seasoningsAPI} from '../../api';

const state = {
    seasonings: [],
    seasoningsAPIError: {
        isError: false
    },
    seasoningsLoaded: false
};

const mutations = {
    [mutation.SEASONING.ADD_SEASONING] (state, seasoning) {
        state.seasonings.push(seasoning);
    },
    [mutation.SEASONING.EDIT_SEASONING] (state, editSeasoning) {
        let index = state.seasonings.findIndex(seasoning => seasoning.id === editSeasoning.id);
        state.seasonings.splice(index, 1, editSeasoning);
    },
    [mutation.SEASONING.REMOVE_SEASONING] (state, seasoningId) {
        let index = state.seasonings.findIndex(seasoning => seasoning.id === seasoningId);
        state.seasonings.splice(index, 1);
    },
    [mutation.SEASONING.SEASONINGS_LOADED] (state) {
        state.seasoningsLoaded = true;
    },
    [mutation.SEASONING.SET_API_ERROR] (state, error) {
        state.seasoningsAPIError = error;
    },
    [mutation.SEASONING.SET_SEASONINGS] (state, seasonings) {
        state.seasonings = seasonings;
    }
};

const actions = {
    deleteSeasoning({ commit }, seasoningId) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.SEASONING.SET_API_ERROR, {isError: false});
            let deletedSeasoning = await seasoningsAPI.deleteSeasoning(seasoningId);
            if(deletedSeasoning.hasOwnProperty('error')) {
                commit(mutation.SEASONING.SET_API_ERROR, {isError: true, error: deletedSeasoning.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.SEASONING.REMOVE_SEASONING, deletedSeasoning.id);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(deletedSeasoning.name);
                }, TIMEOUT);
            }
        })
    },
    editSeasoning({ commit }, payload) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.SEASONING.SET_API_ERROR, {isError: false});
            let editedSeasoning = await seasoningsAPI.editSeasoning(payload.seasoning, payload.removeCompSeasonings);
            if(editedSeasoning.hasOwnProperty('error')) {
                commit(mutation.SEASONING.SET_API_ERROR, {isError: true, error: editedSeasoning.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.SEASONING.EDIT_SEASONING, editedSeasoning);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(editedSeasoning.name);
                }, TIMEOUT);
            }
        });
    },
    fetchSeasonings({ commit }) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.SEASONING.SET_API_ERROR, {isError: false});
            if(!state.seasoningsLoaded) {
                let fetchedSeasonings = await seasoningsAPI.fetchSeasonings();
                if(fetchedSeasonings.hasOwnProperty('errors')) {
                    commit(mutation.SEASONING.SET_API_ERROR, {isError: true, error: fetchedSeasonings.error});
                    setTimeout(() => {
                        commit(mutation.LOADING.STOP);
                        resolve();
                    }, TIMEOUT);
                } else {
                    commit(mutation.SEASONING.SEASONINGS_LOADED);
                    commit(mutation.SEASONING.SET_SEASONINGS, fetchedSeasonings);
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
    saveSeasoning({ commit }, seasoning) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.SEASONING.SET_API_ERROR, {isError: false});
            let fetchedSeasoning = await seasoningsAPI.saveSeasoning(seasoning);
            if(fetchedSeasoning.hasOwnProperty('error')) {
                commit(mutation.SEASONING.SET_API_ERROR, {isError: true, error: fetchedSeasoning.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.SEASONING.ADD_SEASONING, fetchedSeasoning);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(fetchedSeasoning.name);
                }, TIMEOUT);
            }
        });
    }
};

export default {
    state,
    actions,
    mutations
}