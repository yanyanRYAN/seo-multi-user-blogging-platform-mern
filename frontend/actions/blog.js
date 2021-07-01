//auth related methods in here
import fetch from 'isomorphic-fetch';

//bring in API from our config
import {API} from '../config';

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