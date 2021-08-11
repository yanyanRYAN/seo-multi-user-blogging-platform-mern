//auth related methods in here
import fetch from 'isomorphic-fetch';

//bring in API from our config
import {API} from '../config';

import queryString from 'query-string'

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