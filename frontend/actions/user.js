//auth related methods in here
import fetch from 'isomorphic-fetch';

//bring in API from our config
import {API} from '../config';

import queryString from 'query-string'

import {handleResponse} from './auth';

//refer to backend/routes/category.js
export const userPublicProfile = (username) => {
    //takes in blog and token of admin

    return fetch(`${API}/user/${username}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },

    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

export const getProfile = (token) => {
    //takes in blog and token of admin

    return fetch(`${API}/user/profile`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },

    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

export const update = (token, user) => {
    //takes in blog and token of admin

    return fetch(`${API}/user/update`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        //send the body contents
        body: user

    })
    .then(response => {
        handleResponse(response)
        return response.json()
    })
    .catch(err => console.log(err))
}