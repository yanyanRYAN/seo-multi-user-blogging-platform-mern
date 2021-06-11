//auth related methods in here
import fetch from 'isomorphic-fetch';

//bring in API from our config
import {API} from '../config';

export const create = (category, token) => {
    console.log(`token ${token}`)
    console.log(category)
    return fetch(`${API}/category`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`
        },
        body: JSON.stringify(category)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}
