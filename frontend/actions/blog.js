//auth related methods in here
import fetch from 'isomorphic-fetch';

//bring in API from our config
import {API} from '../config';

import queryString from 'query-string'
import {isAuth} from './auth'; //gives us user role

//refer to backend/routes/category.js
export const createBlog = (blog, token) => {
    //takes in blog and token of user

    let createBlogEndpoint;
    if(isAuth() && isAuth().role === 1) {
        //Admin user
        createBlogEndpoint = `${API}/blog`
    } else if (isAuth() && isAuth().role === 0) {
        //Regular user
        createBlogEndpoint = `${API}/user/blog`
    }

    return fetch(`${createBlogEndpoint}`, {
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

export const list = (username) => {
    // username will only have a value if used by the regular user in user/crud/blogs.js component which passes a prop to BlogRead
    // otherwise it will function normally 
    let listBlogsEndpoint;
    if(username) {
        
        listBlogsEndpoint = `${API}/${username}/blogs`;
    } else {
        listBlogsEndpoint = `${API}/blogs`;
    }
    

    return fetch(`${listBlogsEndpoint}`, {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}

export const removeBlog = (slug, token) => {
    //takes in blog and token of admin

    let deleteBlogEndpoint;
    if(isAuth() && isAuth().role === 1) {
        //Admin user
        deleteBlogEndpoint = `${API}/blog/${slug}`
    } else if (isAuth() && isAuth().role === 0) {
        //Regular user
        deleteBlogEndpoint = `${API}/user/blog/${slug}`
    }

    return fetch(`${deleteBlogEndpoint}`, {
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

    let updateBlogEndpoint;
    if(isAuth() && isAuth().role === 1) {
        //Admin user
        updateBlogEndpoint = `${API}/blog/${slug}`
    } else if (isAuth() && isAuth().role === 0) {
        //Regular user
        updateBlogEndpoint = `${API}/user/blog/${slug}`
    }

    return fetch(`${updateBlogEndpoint}`, {
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