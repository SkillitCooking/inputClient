'use strict';

import axios from 'axios';
import {handleError} from '../lib/errors';

async function saveSeasoning(seasoning) {
    try {
        let res = await axios.post('/seasonings', {
            seasoning
        });
        return res.data.data;
    } catch (e) {
        handleError(e);
    }
}

async function deleteSeasoning(seasoningId) {
    try {
        let res = await axios.delete('/seasonings/' + seasoningId);
        return res.data.data[0];
    } catch (e) {
        handleError(e);
    }
}

async function editSeasoning(seasoning, removeCompSeasonings) {
    try {
        let res = await axios.put('/seasonings/' + seasoning.id, {
            seasoning,
            removeCompSeasonings 
        });
        return res.data.data;
    } catch(e) {
        handleError(e);
    }
}

async function fetchSeasonings(ids = []) {
    try {
        let res = await axios.post('/seasonings/getSeasonings', {
            ids
        });
        return res.data.data;
    } catch(e) {
        handleError(e);
    }
}

export default {
    saveSeasoning,
    deleteSeasoning,
    editSeasoning,
    fetchSeasonings
};