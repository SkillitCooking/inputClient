'use strict'

export default Object.freeze({
    USER: {
        SET: 'SET_USER',
        SET_TOKEN: 'SET_TOKEN',
        SET_LOGIN_ERROR: 'SET_LOGIN_ERROR'
    },
    LOADING: {
        START: 'LOADING_START',
        STOP: 'LOADING_STOP'
    },
    TAG: {
        ADD_TAG: 'ADD_TAG',
        REMOVE_TAG: 'REMOVE_TAG',
        EDIT_TAG: 'EDIT_TAG',
        SET_API_ERROR: 'SET_TAG_API_ERR',
        SET_TAGS: 'SET_TAGS',
        TAGS_LOADED: 'TAGS_LOADED'
    },
    UNIT: {
        ADD_UNIT: 'ADD_UNIT',
        REMOVE_UNIT: 'REMOVE_UNIT',
        EDIT_UNIT: 'EDIT_UNIT',
        SET_API_ERROR: 'SET_UNIT_API_ERR',
        UNITS_LOADED: 'UNITS_LOADED',
        SET_UNITS: 'SET_UNITS'
    }
});