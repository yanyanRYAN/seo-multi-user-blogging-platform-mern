//auth related methods in here
import fetch from 'isomorphic-fetch';

//bring in API from our config
import {API} from '../config';

import queryString from 'query-string'

//refer to backend/routes/category.js
export const createBlog = (blog, token) => {
    //takes in blog and token of admin

    return fetch(`${API}/blog`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            //takes in form data so no need for content type
            Authorization: `bearer ${token}`
        },
        body: blog
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

// export const listBlogsWithCategoriesAndTags = () => {

//     return fetch(`${API}/blogs-categories-tags`, {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//         },
        
//     })
//     .then(response => {
//         return response.json()
//     })
//     .catch(err => console.log(err))
// }

export const listBlogsWithCategoriesAndTags = (skip, limit) => {
    
    const data = {
        limit, skip
    };

    return fetch(`${API}/blogs-categories-tags`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

export const singleBlog = slug => {
    return fetch(`${API}/blog/${slug}`, {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}

export const listRelated = (blog) => {
    
    return fetch(`${API}/blogs/related`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blog)
        
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

export const list = () => {
    return fetch(`${API}/blogs/`, {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}

export const removeBlog = (slug, token) => {
    //takes in blog and token of admin

    return fetch(`${API}/blog/${slug}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            //takes in form data so no need for content type
            Authorization: `bearer ${token}`
        },
        
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

export const updateBlog = (blog, token, slug) => {
    //takes in blog and token of admin

    return fetch(`${API}/blog/${slug}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            //takes in form data so no need for content type
            Authorization: `bearer ${token}`
        },
        body: blog
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

// we will be passing params whilst using GET instead of post
export const listSearch = (params) => {
    console.log('search params', params)
    let query = queryString.stringify(params) // ?limit=100&pagenation=10 
    console.log('query params', query)  // {search= 'node'}
    return fetch(`${API}/blogs/search?${query}`, {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}