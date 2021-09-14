//auth related methods in here
import fetch from 'isomorphic-fetch';

import cookie from 'js-cookie';

//bring in API from our config
import {API} from '../config';

import Router from 'next/router'

export const handleResponse = response => {
    // this is a helper method to handle the expiration of the user's token
    if(response.status === 401) {
        signout(() => {
            Router.push({
                pathname: '/signin',
                query: {
                    message: 'Your session is expired. Please signin.'
                }
            })
        })   
    } else {
        return;
    }
}

export const preSignup = (user) => {
    return fetch(`${API}/pre-signup`, {
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

export const signout = (next) => {
    removeCookie('token');
    removeLocalStorage('user')
    next();

    return fetch(`${API}/signout`, {
        method: 'GET'
    })
    .then(response => {
        console.log('signout success')
    })
    .catch(err => console.log(err));
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
       return cookie.get(key, {
            expires: 1
        }); //was not getting cookie forgot to add return
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
        //check if we have the cookie or else we might not have genuine/authenticated user  //later ->> we can also use this for conditional rendering
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


export const updateUser = (user, next) => {
    // accepts user, and next -- which is a callback that gives us a functionality to do something else after
    //check if we are in client side
    if(process.browser) {
        if(localStorage.getItem('user')){
            let auth = JSON.parse(localStorage.getItem('user'))
            auth = user;  //set auth to the user that has been sent
            localStorage.setItem('user', JSON.stringify(auth))
            next()
        }
    }
}

export const forgotPassword = (email) => { 
    return fetch(`${API}/forgot-password`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(email)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

export const resetPassword = (resetInfo) => { 
    return fetch(`${API}/reset-password`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resetInfo)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}