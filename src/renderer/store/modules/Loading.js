'use strict';

import mutation from '../mutation-types';

const state = {
    loading: false
};

const mutations = {
    [mutation.LOADING.START] (state) {
        state.loading = true;
    },
    [mutation.LOADING.STOP] (state) {
        state.loading = false;
    }
};

export default {
    state,
    mutations
};