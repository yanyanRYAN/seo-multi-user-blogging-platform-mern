import React from 'react';
import {useState} from 'react';



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

    const {name, email, password, error, loading, message, showForm} = values; //destructure

    const handleSubmit = (e) => {
        e.preventDefault(); //prevent the page from refreshing 
        console.table({name, email, password, error, loading, message, showForm})
    }

    const handleChange = (name) => (e) => {
        //e.preventDefault(); //prevent the page from refreshing 
        setValues({...values, error: false, [name]: e.target.value})
        console.log(e.target.value);
    }


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
            {signupForm()}
        </React.Fragment>
        
    )
}

export default SignupComponent;