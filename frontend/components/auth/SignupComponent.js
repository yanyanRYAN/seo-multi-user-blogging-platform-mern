import  Router  from 'next/router';
import React, { useEffect } from 'react';
import {useState} from 'react';
import {isAuth, signup, preSignup} from '../../actions/auth';
import Link from 'next/link'

const SignupComponent = () =>{

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    }) //properties under password will be used later...

    useEffect(() => {
        // check if user is already authenticated, if they are automatic redirect.
        if(isAuth()){
            Router.replace('/');
        }
    })

    const {name, email, password, error, loading, message, showForm} = values; //destructure

    const handleSubmit = (e) => {
        e.preventDefault(); //prevent the page from refreshing 
        //console.table({name, email, password, error, loading, message, showForm})
        //before we submit we want to set values in the state
        setValues({...values, loading: true, error: false});
        const user =  {name, email, password} 

        preSignup(user) //presignup user
        .then(data => {
            //first check for error response
            if(data.error){
                //error: 'string of error'  NOT err or e
                //make sure that the error key matches the data.error object because then it will not populate
                // take note of the values variable   
                setValues({...values, error: data.error, loading: false}) //set error message
            } else {
                //if no error, the user should have been successfully made
                //clear the values
                setValues({...values, 
                    name: '', 
                    email: '', 
                    password: '', 
                    error: '', 
                    loading: false, 
                    message: data.message,
                    showForm: false    
                })
                //^^once the user is created we want to hide the form showForm:false
            }
        })
        
    }

    const handleChange = (name) => (e) => {
        //e.preventDefault(); //prevent the page from refreshing 
        setValues({...values, error: false, [name]: e.target.value})
        
    }

    const showLoading = () => (loading ? <div className="alert alert-info">Loading...</div> : '')
        
    const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '')
      
    const showMessage= () => (message ? <div className="alert alert-info">{message}</div> : '')
        
    


    const signupForm = () => {
        return(
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input value={name} onChange={handleChange('name')} type="text" className="form-control" placeholder="Type your name"></input>
            </div>
            <div className="form-group">
                <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Type your email"></input>
            </div>
            <div className="form-group">
                <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Type your password"></input>
            </div>

            <div>
                <button className="btn btn-primary">Signup</button>
            </div>

        </form>
        )
    }


    return (
        <React.Fragment>
            {showError()}
            {showLoading()}
            {showMessage()}
            {showForm && signupForm()}
            <br />
            <Link href="/auth/password/forgot">
                <a className="btn btn-outline-danger btn-sm">Forgot Password</a>
            </Link>
            
        </React.Fragment>
        
    )
}

export default SignupComponent;