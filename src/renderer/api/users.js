'use strict';

import axios from 'axios';

async function login(username, password) {
    try {
        let res = await axios.post('/users/authenticate', {
            user: {
                username,
                password
            }
        });
        return res.data.user;
    } catch (e) {
        console.log('error', e.message);
        return {
            error: e,
            status: e.response.data.status
        };
    }
}

export default {
    login
}