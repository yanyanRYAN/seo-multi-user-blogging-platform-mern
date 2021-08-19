import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { getCookie, isAuth, updateUser } from '../../actions/auth'
import { getProfile, update } from '../../actions/user'
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config'

const ProfileUpdate = () => {
    const [values, setValues] = useState({
        username: '',
        usernameForPhoto: '',
        name: '',
        email: '',
        about: '',
        password: '',
        error: false,
        success: false,
        loading: false,
        photo: '',
        userData: process.browser && new FormData()
    })

    const [uploadedPhoto, setUploadedPhoto] = useState(false);

    const token = getCookie('token');
    const { username, usernameForPhoto, name, email, about, password, error, success, loading, photo, userData } = values;

    const init = () => {
        getProfile(token).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({
                    ...values,
                    username: data.username,
                    usernameForPhoto: data.username,
                    name: data.name,
                    email: data.email,
                    about: data.about,
                })
            }
        })
    }

    useEffect(() => {
        init();
    }, [])

    const handleChange = name => e => {
        
        
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        //let userFormData = new FormData();
        if(name === 'photo') {
            console.log("handle Change has a photo:" , name)
            console.log("handle Change", e.target.files[0])
            setUploadedPhoto(true)
        }
        console.log("value: " , value);
        // .set(name of whats passed in, data)
        userData.set(name, value); //this is what will be sent into the backend
        console.log("name: ", name)
        
        // if(setUploadedPhoto){
        //     userFormData.set("photo", photo)
        // }

        setValues({
            ...values,
            [name]: value,
            userData, 
            error: false,
            success: false
        });

        console.table(values);
    }

    const handleSubmit = e => {
        //
        e.preventDefault();
        console.log("handle submit")
        console.table(values);
        console.log("userData", userData)
        
        
        for(var pair of userData.entries() ){
            console.log(pair[0]+ ', ' + pair[1])
        }

        console.log(photo)
        
        setValues({...values, loading: true});
        update(token, userData).then(data => {
            if(data.error) {
                console.log(data.error)
                setValues({...values, error: data.error, success: false, loading: false})
            } else {
                updateUser(data, () => {
                    setValues({
                        ...values,
                        username: data.username,
                        name: data.name,
                        email: data.email,
                        about: data.about,
                        success: true,
                        loading: false
                    })
                    Router.reload();
                })
                // setValues({
                //     ...values,
                //     username: data.username,
                //     name: data.name,
                //     email: data.email,
                //     about: data.about,
                //     success: true,
                //     loading: false
                // })
            }
        })
    }



    const profileUpdateForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="btn btn-outline-info">
                    Profile Photo
                    <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                </label>
            </div>
            <div className="form-group">
                <label className="text-muted">Username</label>
                <input onChange={handleChange('username')} type="text" value={username} className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" value={name} className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')} type="text" value={email} className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">About</label>
                <textarea onChange={handleChange('about')} type="text" value={about} className="form-control" />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')} type="password" value={password} className="form-control" />
            </div>
            <div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className="alert alert-success" style={{display: success ? '' : 'none'}}>
            Profile updated
        </div>
    )

    const showLoading = () => (
        <div className="alert alert-info" style={{display: loading ? '' : 'none'}}>
            Loading...
        </div>
    )

    return (
        <React.Fragment>
            <div className="container">
            {username}
                <div className="row">
                    <div className="col-md-4">
                        <img
                            src={`${API}/user/photo/${usernameForPhoto}`}
                            className="img img-fluid img-thumbnail mb-3"
                            style={{maxHeight: 'auto', maxWidth: '100%'}}
                            alt="user profile"
                         />
                    </div>
                    <div className="col-md-8 mb-5">
                        {showSuccess()}
                        {showError()}
                        {showLoading()}
                        {profileUpdateForm()}
                    </div>

                </div>

            </div>
        </React.Fragment>
    )
}

export default ProfileUpdate;