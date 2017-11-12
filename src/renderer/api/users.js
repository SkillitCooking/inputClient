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
        if(res.error) {
            handleError(e);
            return res;
        }
        return res.data.user;
    } catch (e) {
       handleError(e);
    }
}

//eventually introduce some sort of pagination?
async function fetchUsers() {
    try {
        let res = await axios.get('/users');
        if(res.error) {
            handleError(e);
            return res;
        }
        return res.data.users;
    } catch (e) {
        handleError(e);
    }
}

async function saveUser(user) {
    try {
        let res = await axios.post('/users', {
            user
        });
        if(res.error) {
            handleError(e);
            return res;
        }
        return res.data.user;
    } catch (e) {
        handleError(e);
    }
}

async function editUser(user) {
    try {
        let res = await axios.put('/users/' + user.id, {
            user
        });
        if(res.error) {
            handleError(e);
            return res;
        }
        return res.data.user;
    } catch (e) {
        handleError(e);
    }
}

async function deleteUser(userId) {
    try {
        let res = await axios.delete('/users/' + userId);
        if(res.error) {
            handleError(e);
            return res;
        }
        return res.data.data[0];
    } catch (e) {
        handleError(e);
    }
}

export default {
    login,
    fetchUsers,
    saveUser,
    editUser,
    deleteUser
}