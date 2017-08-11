'use strict';

import mutation from '../mutation-types';
import {TIMEOUT} from '../constants';
import {tags as tagAPI} from '../../api';

const state = {
    tags: [],
    tagAPIError: {
        isError: false
    },
    tagsLoaded: false
};

const actions = {
    saveTag({ commit }, tag) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.TAG.SET_API_ERROR, {isError: false});
            let fetchedTag = await tagAPI.saveTag(tag);
            if(fetchedTag.hasOwnProperty('error')) {
                commit(mutation.TAG.SET_API_ERROR, {isError: true, error: fetchedTag.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.TAG.ADD_TAG, fetchedTag);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(fetchedTag.name);
                }, TIMEOUT)
            }
        })
    },
    deleteTag({ commit }, tagId) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.TAG.SET_API_ERROR, {isError: false});
            let deletedTag = await tagAPI.deleteTag(tagId);
            if(deletedTag.hasOwnProperty('error')) {
                commit(mutation.TAG.SET_API_ERROR, {isError: true, error: deletedTag.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.TAG.REMOVE_TAG, deletedTag.id);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(deletedTag.name);
                }, TIMEOUT);
            }
        });
    },
    editTag({ commit }, tag) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.TAG.SET_API_ERROR, {isError: false});
            let editedTag = await tagAPI.editTag(tag);
            console.log('editedTag', editedTag);
            if(editedTag.hasOwnProperty('error')) {
                commit(mutation.TAG.SET_API_ERROR, {isError: true, error: deletedTag.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.TAG.EDIT_TAG, editedTag);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(editedTag.name);
                }, TIMEOUT);
            }
        })
    },
    fetchTags({ commit }) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.TAG.SET_API_ERROR, {isError: false});
            if(!state.tagsLoaded) {
                let fetchedTags = await tagAPI.fetchTags();
                if(fetchedTags.hasOwnProperty('error')) {
                    commit(mutation.TAG.SET_API_ERROR, {isError: true, error: fetchedTags.error});
                    setTimeout(() => {
                        commit(mutation.LOADING.STOP);
                        resolve();
                    }, TIMEOUT);
                } else {
                    commit(mutation.TAG.TAGS_LOADED);
                    commit(mutation.TAG.SET_TAGS, fetchedTags);
                    setTimeout(() => {
                        commit(mutation.LOADING.STOP);
                        resolve();
                    }, TIMEOUT)
                }
            } else {
                resolve();
            }
        });
    }
};

const mutations = {
    [mutation.TAG.ADD_TAG] (state, tag) {
        state.tags.push(tag);
    },
    [mutation.TAG.REMOVE_TAG] (state, tagId) {
        let index = state.tags.findIndex(tag => tag.id === tagId);
        state.tags.splice(index, 1);
    },
    [mutation.TAG.EDIT_TAG] (state, editTag) {
        console.log('editTag', editTag);
        let index = state.tags.findIndex(tag => tag.id === editTag.id);
        state.tags.splice(index, 1, editTag);
    },
    [mutation.TAG.SET_API_ERROR] (state, error) {
        state.tagAPIError = error;
    },
    [mutation.TAG.SET_TAGS] (state, tags) {
        state.tags = tags;
    },
    [mutation.TAG.TAGS_LOADED] (state) {
        state.tagsLoaded = true;
    }
};

export default {
    state,
    actions,
    mutations
}