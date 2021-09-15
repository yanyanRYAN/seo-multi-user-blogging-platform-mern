import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import GoogleLogin from 'react-google-login'
import { loginWithGoogle, authenticate, isAuth } from '../../actions/auth'
import { API, GOOGLE_CLIENT_ID } from '../../config'

const LoginGoogle = () => {

    const responseGoogle = response => {
        //console.log(response);
        const tokenId = response.tokenId; 
        const user = {tokenId};

        loginWithGoogle(user).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                authenticate(data, () => { // data contains token and user, then redirect
                    //redirect based on role
                    // now check for role 
                    console.log(isAuth());
                    if (isAuth() && isAuth().role == 1) {
                        Router.push('/admin');
                    } else {
                        Router.push('/user');
                    }
                })

            }
        })
    }

    return <div className="pb-3">
        <GoogleLogin
            clientId={`${GOOGLE_CLIENT_ID}`}
            buttonText="Login with Google"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            theme="dark"
        />
    </div>
}

export default LoginGoogle;