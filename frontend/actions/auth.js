//auth related methods in here
import fetch from 'isomorphic-fetch';

import cookie from 'js-cookie';

//bring in API from our config
import {API} from '../config';

export const signup = (user) => {
    return fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

export const signin = (user) => { //pretty much the same
    return fetch(`${API}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

// set cookie
export const setCookie = (key, value) => {
    //first check to see if we are in client or server side
    // process.browser means this is client side.
    if(process.browser) {
        cookie.set(key, value, {
            expires: 1
        });
    }
}

export const removeCookie = (key) => {
    if(process.browser) {
        cookie.remove(key, {
            expires: 1
        });
    }
}

// get cookie

export const getCookie = (key) => {
    if(process.browser) {
        cookie.get(key, {
            expires: 1
        });
    }
}

// local storage

export const setLocalStorage = (key, value) => {
    if(process.browser) {
        localStorage.setItem(key, JSON.stringify(value))//save as a json string
    }
}

export const removeLocalStorage = (key) => {
    if(process.browser) {
        localStorage.removeItem(key)
    }
}
// authenticate user by pass data to cookie and localstorage
export const authenticate = (data, next) => { //takes in data, next is a callback function
    //data is what we get from the response in signinComponent.handleSubmit.signin

    // first set cookie
    // called 'token' and will take in the data.token since we sent the token of the user as well as
    // the user information
    setCookie('token', data.token) 
    setLocalStorage('user', data.user)
    next(); //is a middleware -- will execute what we passed in
};

// get the authenticated user's information from the localstorage so that it can be used anywhere in the app

export const isAuth = () => {
    if(process.browser) {
        //check if we have the cookie or else we might not have genuine/authenticated user
        const cookieChecked = getCookie('token'); //if we can get this then we have a user
        if(cookieChecked) {
            if(localStorage.getItem('user')) {
                // since this was previously saved as a Stringified JSON in setLocalStorage
                // we want to parse this so that we can use it as a JSON object.
                return JSON.parse(localStorage.getItem('user'))
                
            } else {
                return false;
            }
        }
    }
}
