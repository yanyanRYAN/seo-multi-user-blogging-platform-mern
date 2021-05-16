import Router from 'next/router';
import React from 'react';
import {useState} from 'react';
import {signin, authenticate} from '../../actions/auth';


const SigninComponent = () =>{

    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    }) //properties under password will be used later...

    const { email, password, error, loading, message, showForm} = values; //destructure

    const handleSubmit = (e) => {
        e.preventDefault(); //prevent the page from refreshing 
        //console.table({name, email, password, error, loading, message, showForm})
        //before we submit we want to set values in the state
        setValues({...values, loading: true, error: false});
        const user =  { email, password} 

        signin(user)
        .then(data => {
            //first check for error response
            if(data.error){
                //error: 'string of error'  NOT err or e
                //make sure that the error key matches the data.error object because then it will not populate
                // take note of the values variable   
                setValues({...values, error: data.error, loading: false}) //set error message
            } else {
                // save user token to cookie
                // save user info to localstorage
                // authenticate user
                authenticate(data, () => {
                    //redirect based on role
                    Router.push(`/`)
                })

                

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
        
    


    const signinForm = () => {
        return(
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Type your email"></input>
            </div>
            <div className="form-group">
                <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Type your password"></input>
            </div>
            <div>
                <button className="btn btn-primary">Signin</button>
            </div>

        </form>
        )
    }


    return (
        <React.Fragment>
            {showError()}
            {showLoading()}
            {showMessage()}
            {showForm && signinForm()}
            
        </React.Fragment>
        
    )
}

export default SigninComponent;