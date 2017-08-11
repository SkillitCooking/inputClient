'use strict';

import axios from 'axios';
import {handleError} from '../lib/errors';

//returns full tag
async function saveTag(tag) {
    try {
        let res = await axios.post('/tags', {
            tag
        });
        return res.data.data;
    } catch(e) {
       handleError(e);
    }
}

async function fetchTags() {
    try {
        let res = await axios.get('/tags');
        return res.data.data;
    } catch (e) {
        handleError(e);
    }
}

async function deleteTag(tagId) {
    try {
        let res = await axios.delete('/tags/' + tagId);
        return res.data.data[0];
    } catch (e) {
        handleError(e);
    }
}

async function editTag(tag) {
    try {
        let res = await axios.put('/tags/' + tag.id, {tag});
        return res.data.data[0];
    } catch (e) {
        handleError(e);
    }
}

export default {
    saveTag,
    fetchTags,
    deleteTag,
    editTag
}