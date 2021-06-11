import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, getCookie } from '../../actions/auth'; //get token from isAuth.  Get gookie from local storage and send it when create is called from actions
import { create } from '../../actions/category';

const Category = () => {
    //we will have alot of categories when we request from backend so they will be stored in the categories array
    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        categories: [],
        removed: false
    })

    const clickSubmit = (e) => {
        e.preventDefault();
        //console.log('create category', name);
        create({name},token).then(data => {
            if(data.error){
                setValues({
                    ...values,
                    error: data.error,
                    success: false
                })
            } else {
                setValues({
                    ...values,
                    error: false,
                    success: true,
                    name: ''
                })
            }
        })
    }

    const handleChange = (e) => {
        setValues({ ...values, name: e.target.value, error: false, success: false, removed: '' })
    }

    //destructure from values
    const { name, error, success, categories, removed } = values;
    const token = getCookie('token');

    const newCategoryForm = () => {

        return (
            <form onSubmit={clickSubmit}>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input type="text" className="form-control" onChange={handleChange} value={name} required />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">Create</button>
                </div>
            </form>
        )

    }

    return (<React.Fragment>
        {newCategoryForm()}
    </React.Fragment>
    )

}

export default Category;