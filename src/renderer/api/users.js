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
        console.log(e.message);
    }
}

export default {
    login
}