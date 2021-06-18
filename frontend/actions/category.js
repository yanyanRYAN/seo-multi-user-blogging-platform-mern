//auth related methods in here
import fetch from 'isomorphic-fetch';

//bring in API from our config
import {API} from '../config';

//refer to backend/routes/category.js
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

export const getCategories = () => {
    return fetch(`${API}/categories`, {
        method: 'GET',
        
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

export const singleCategory = (slug) => { 
    return fetch(`${API}/category/${slug}`, {
        method: 'GET',
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

export const removeCategory = (slug, token) => {
    //console.log(`token ${token}`)
    //console.log(slug)
    return fetch(`${API}/category/${slug}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`
        },
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}