'use strict';

import mutation from '../mutation-types';
import {TIMEOUT} from '../constants';
import {units as unitsAPI} from '../../api';

const state = {
    units: [],
    unitsAPIError: {
        isError: false
    },
    unitsLoaded: false
};

const actions = {
    saveUnit({ commit }, unit) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.UNIT.SET_API_ERROR, {isError: false});
            let fetchedUnit = await unitsAPI.saveUnit(unit);
            if(fetchedUnit.hasOwnProperty('error')) {
                commit(mutation.UNIT.SET_API_ERROR, {isError: true, error: fetchedUnit.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.UNIT.ADD_UNIT, fetchedUnit);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(fetchedUnit.nameSingular);
                }, TIMEOUT);
            }
        })
    },
    fetchUnits({ commit }) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.UNIT.SET_API_ERROR, {isError: false});
            if(!state.unitsLoaded) {
                let fetchedUnits = await unitsAPI.fetchUnits();
                if(fetchedUnits.hasOwnProperty('error')) {
                    commit(mutation.UNIT.SET_API_ERROR, {isError: true, error: fetchedUnits.error});
                    setTimeout(() => {
                        commit(mutation.LOADING.STOP);
                        resolve();
                    }, TIMEOUT);
                } else {
                    commit(mutation.UNIT.UNITS_LOADED);
                    commit(mutation.UNIT.SET_UNITS, fetchedUnits);
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
    editUnit({ commit }, unit) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.UNIT.SET_API_ERROR, {isError: false});
            let editedUnit = await unitsAPI.editUnit(unit);
            if(editedUnit.hasOwnProperty('error')) {
                commit(mutation.UNIT.SET_API_ERROR, {isError: true, error: editedUnit.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.UNIT.EDIT_UNIT, editedUnit);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(editedUnit.nameSingular);
                }, TIMEOUT)
            }
        })
    },
    deleteUnit({ commit }, unitId) {
        return new Promise(async (resolve, reject) => {
            commit(mutation.LOADING.START);
            commit(mutation.UNIT.SET_API_ERROR, {isError: false});
            let deletedUnit = await unitsAPI.deleteUnit(unitId);
            if(deletedUnit.hasOwnProperty('error')) {
                commit(mutation.UNIT.SET_API_ERROR, {isError: true, error: deletedUnit.error});
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    reject();
                }, TIMEOUT);
            } else {
                commit(mutation.UNIT.REMOVE_UNIT, deletedUnit.id);
                setTimeout(() => {
                    commit(mutation.LOADING.STOP);
                    resolve(deletedUnit.nameSingular);
                }, TIMEOUT);
            }
        });
    }
};

const mutations = {
    [mutation.UNIT.SET_API_ERROR] (state, error) {
        state.unitsAPIError = error
    },
    [mutation.UNIT.ADD_UNIT] (state, unit) {
        state.units.push(unit);
    },
    [mutation.UNIT.UNITS_LOADED] (state) {
        state.unitsLoaded = true;
    },
    [mutation.UNIT.SET_UNITS] (state, units) {
        state.units = units;
    },
    [mutation.UNIT.REMOVE_UNIT] (state, unitId) {
        let index = state.units.findIndex(unit => unit.id === unitId);
        state.units.splice(index, 1);
    },
    [mutation.UNIT.EDIT_UNIT] (state, editUnit) {
        let index = state.units.findIndex(unit => unit.id === editUnit.id);
        state.units.splice(index, 1, editUnit);
    }
};

export default {
    state,
    actions,
    mutations
};