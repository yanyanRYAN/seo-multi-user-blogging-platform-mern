import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, getCookie } from '../../actions/auth'; //get token from isAuth.  Get gookie from local storage and send it when create is called from actions
import { create, getCategories, removeCategory } from '../../actions/category';

const Category = () => {
    //we will have alot of categories when we request from backend so they will be stored in the categories array
    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        categories: [],
        removed: false,
        reload: false
    })

    //destructure from values
    const { name, error, success, categories, removed, reload } = values;
    const token = getCookie('token');

    //load the categories when the component mounts
    useEffect(() =>{
        loadCategories()
    }, [reload])

    const loadCategories = () => {
        getCategories().then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                setValues({...values, categories: data})
            }
        })
    };

    const showCategories = () => {
        return categories.map((category, index) => {
            //console.table(category);
            return <button onDoubleClick={() => deleteConfirm(category.slug)} 
            title="Double click to delete" key={index} 
            className="btn btn-outline-primary mr-1 ml-1 mt-3">{category.name}</button>
        })
    }

    const deleteConfirm = slug => {
        let answer = window.confirm('Are you sure you want to delete this category?');
        if(answer) {
            deleteCategory(slug)
        }
    }

    const deleteCategory = slug => {
        //console.log('delete', slug);
        removeCategory(slug, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                //console.log('check error', data.error);
                setValues({...values, error: false, success: false, name: '', removed: !removed, reload: !reload});
            }
        })
    }

    const clickSubmit = (e) => {
        e.preventDefault();
        //console.log('create category', name);
        // {name} == {name: name}
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
                    name: '',
                    removed: '',
                    reload: !reload
                })
            }
        })
    }

    const handleChange = (e) => {
        setValues({ ...values, name: e.target.value, error: false, success: false, removed: '' })
    }

    const showSuccess = () => {
        if(success) {
            return <p className="text-success">Category successfully created.</p>
        }
    }

    const showError = () => {
        if(error) {
            return <p className="text-danger">Category already exists.</p>
        }
    }

    const showRemoved = () => {
        if(removed) {
            return <p className="text-danger">Category removed.</p>
        }
    }

    const mouseMoveHandler = e => {
        setValues({...values, error: false, success: false, removed: ''})
    }

    const newCategoryForm = () => {

        return (
            <form onSubmit={clickSubmit}>
                <div className="form-group">
                    <label className="text-muted">Category</label>
                    <input type="text" className="form-control" onChange={handleChange} value={name} required />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">Create</button>
                </div>
            </form>
        )

    }

    return (<React.Fragment>
        {showSuccess()}
        {showError()}
        {showRemoved()}
        
        <div onMouseMove={mouseMoveHandler}>
        {newCategoryForm()}
        {showCategories()}
        </div>
    </React.Fragment>
    )

}

export default Category;