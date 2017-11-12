'use strict';

import axios from 'axios';
import {handleError} from '../lib/errors';

async function saveUnit(units) {
    try {
        let res = await axios.post('/units', {
            units
        });
        if(res.error) {
            handleError(e);
            return res;
        }
        return res.data.data;
    } catch (e) {
        handleError(e);
    }
}

async function deleteUnit(unitId) {
    try {
        let res = await axios.delete('/units/' + unitId);
        if(res.error) {
            handleError(e);
            return res;
        }
        return res.data.data[0];
    } catch (e) {
        handleError(e);
    }
}

async function editUnit(units) {
    try {
        let res = await axios.put('/units/' + units.id, {units});
        if(res.error) {
            handleError(e);
            return res;
        }
        return res.data.data[0];
    } catch (e) {
        handleError(e);
    }
}

async function fetchUnits() {
    try {
        let res = await axios.get('/units');
        if(res.error) {
            handleError(e);
            return res;
        }
        return res.data.data;
    } catch (e) {
        handleError(e);
    }
}

export default {
    saveUnit,
    deleteUnit,
    editUnit,
    fetchUnits
}