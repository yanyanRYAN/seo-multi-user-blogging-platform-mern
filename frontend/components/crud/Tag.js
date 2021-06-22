import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, getCookie } from '../../actions/auth'; //get token from isAuth.  Get gookie from local storage and send it when create is called from actions
import {create, getTags, removeTag} from '../../actions/tag';

const Tag = () => {

    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        tags: [],
        removed: false,
        reload: false
    });

    //destructure
    const {name, error, success, tags, removed, reload } = values;
    const token = getCookie('token');

    //load tags when component mounts
    useEffect(() => {
        loadTags()
    },[reload])

    const loadTags = () => {
        getTags().then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                setValues({...values, tags: data})
            }
        })
    };

    const showTags = () => {
        return tags.map((tag, index) => {
            console.table(tag);
            return <button 
            onDoubleClick={() => deleteConfirm(tag.slug)}
            key={index} 
            className="btn btn-outline-secondary mr-1 ml-1 mt-3">{tag.name}</button>
        })
    }

    const deleteConfirm = slug => {
        let answer = window.confirm('Are you sure you want to delete this tag?');
        if(answer) {
            deleteTag(slug)
        }
    }

    const deleteTag = slug => {
        removeTag(slug, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                setValues(
                    {...values, 
                        error: false, 
                        success: false, 
                        name: '', 
                        removed: !removed, 
                        reload: !reload
                    });
            }
        })
    }

    const handleChange = (e) => {
        setValues({ ...values, name: e.target.value, error: false, success: false, removed: ''})
    }

    const clickSubmit = (e) => {
        
        e.preventDefault();
        create({name},token).then(data => {
            
            if(data.error){
                console.log(`error`)
                setValues({
                    ...values,
                    error: 'data.error',
                    success:false
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

    const showSuccess = () => {
        if(success) {
            return <p className="text-success">Tag successfully created.</p>
        }
    }

    const showError = () => {
        if(error) {
            return <p className="text-danger">Tag already exists.</p>
        }
    }

    const showRemoved = () => {
        if(removed) {
            return <p className="text-danger">Tag removed.</p>
        }
    }

    const mouseMoveHandler = e =>{
        setValues({...values, error: false, success:false, removed: ''})
    }

    const newTagForm = () => {
        return (
            <form onSubmit={clickSubmit}>
                 <div className="form-group">
                    <label className="text-muted">Tag</label>
                    <input type="text" className="form-control" onChange={handleChange} value={name} required />
                </div>
                <div>
                    <button type="submit" className="btn btn-secondary">Create</button>
                </div>
            </form>
        )
    }

    return <React.Fragment>
        {showSuccess()}
        {showError()}
        {showRemoved()}
        
        <div onMouseMove={mouseMoveHandler}>
            {newTagForm()}
            {showTags()}
        </div>
        
    </React.Fragment>
}

export default Tag