'use strict';

import axios from 'axios';
import {handleError} from '../lib/errors';

async function login(username, password) {
    try {
        let res = await axios.post('/users/authenticate', {
            user: {
                username,
                password
            }
        });
        //set token
        axios.defaults.headers.common['Authorization'] = "Bearer " + res.data.user.token;
        return res.data.user;
    } catch (e) {
       handleError(e);
    }
}

export default {
    login
}