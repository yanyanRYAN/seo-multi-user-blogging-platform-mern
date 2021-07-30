import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import dynamic from 'next/dynamic' /*used with react quill as rich text editor, only runs in 
client side.  since next js runs both client and server side. this component makes sure we do not use
server side rendering.  Import this so that SSR is false
*/
import { withRouter } from 'next/router' //allows us to use router like react with props.  {router} props
import { getCookie, isAuth } from '../../actions/auth'
import { getCategories } from '../../actions/category' //get categories and tags
import { getTags } from '../../actions/tag'
import { singleBlog, updateBlog } from '../../actions/blog'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import '../../node_modules/react-quill/dist/quill.snow.css'
import { QuillModules, QuillFormats } from '../../helpers/quill'

import {DOMAIN, API} from '../../config';

//import FormData from 'form-data'
const BlogUpdate = ({ router }) => {
    const [body, setBody] = useState('');
    const [values, setValues] = useState({
        error: '',
        success: '',
        formData: '',
        title: '',
        body: '',
        photo: ''
    });

    //const form = new FormData();

    const { error, success, formData, title, photo } = values;

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [checkedCat, setCheckedCat] = useState([]); //categories
    const [checkedTag, setCheckedTag] = useState([]); //tags

    const [hasPhoto, setHasPhoto] = useState(false);

    const token = getCookie('token');

    //get blog
    const [blog, setBlog] = useState({});

    useEffect(() => {
        initBlog();
        initCategories();
        initTags();
        setValues({ ...values,});
    }, [router]);

    const initBlog = () => {
        if (router.query.slug) {
            singleBlog(router.query.slug).then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setValues({ ...values, title: data.title });
                    setBody(data.body);
                    //set the categories and tags
                    setCategoriesArray(data.categories);
                    setTagsArray(data.tags)
                }
            })
        }
    };

    const setCategoriesArray = (blogCategories) => {
        let catArray = []
        blogCategories.map((c,i) => {
            catArray.push(c._id)
        });
        setCheckedCat(catArray);


    }

    const setTagsArray = (blogTags) => {
        let tagArray = []
        blogTags.map((t,i)=> {
            tagArray.push(t._id)
        })
        setCheckedTag(tagArray)
    }

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setCategories(data)
            }
        })
    };

    const initTags = () => {
        getTags().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setTags(data)
            }
        })
    };

    const handleCatToggle = c => () => {
        //cant pass params to a function outside a function ex: onChange
        // so we nest an anonymous function
        setValues({ ...values, error: '' });

        // return the first index or -1
        const clickedCategory = checkedCat.indexOf(c);
        const all = [...checkedCat];

        if (clickedCategory === -1) {
            all.push(c)
        } else {
            all.splice(clickedCategory, 1) //remove 1
        }
        console.log('Checked Categories')
        console.log(all)
        setCheckedCat(all);
        //formData.append('categories', all);

    };

    const handleTagToggle = t => () => {
        //cant pass params to a function outside a function ex: onChange
        // so we nest an anonymous function
        setValues({ ...values, error: '' });

        // return the first index or -1
        const clickedTag = checkedTag.indexOf(t);
        const all = [...checkedTag];

        if (clickedTag === -1) {
            all.push(t)
        } else {
            all.splice(clickedTag, 1) //remove 1
        }
        console.log('Checked Tags');
        console.log(all);
        setCheckedTag(all);
        //formData.append('tags', all);

    };

    const findOutCategory = c => {
        //if 0 it exists -1 it does not
        const result = checkedCat.indexOf(c) //will check the cat array in state if it exists 
        if(result != -1) {
            //returns true because in checked -- if true it will mark the checkbox
            return true;
        } else {
            return false;
        }
    };

    const findOutTag = t => {
        //if 0 it exists -1 it does not
        const result = checkedTag.indexOf(t) //will check the tag array in state if it exists 
        if(result != -1) {
            //returns true because in checked -- if true it will mark the checkbox
            return true;
        } else {
            return false;
        }
    };

    const showCategories = () => {
        return (
            //logical predicates -- if categories exists then we will map
            categories && categories.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleCatToggle(c._id)} checked={findOutCategory(c._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>

            ))
        )
    };

    const showTags = () => {
        return (
            //logical predicates -- if categories exists then we will map
            tags && tags.map((t, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleTagToggle(t._id)} checked={findOutTag(t._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{t.name}</label>
                </li>

            ))
        )
    };


    const handleChange = (name) => (e) => {
        //let formData = new FormData();
        // a function returning another function -- curried function
        //console.log(e.target.value);
        //dynamically handle change 
        //if it is a photo it will grab target.files else will get target value
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        //instantiate new form data with use effect when component loads

        // .set(name of whats passed in, data)
        //formData.append(name, value); //this is what will be sent into the backend
        console.log("handle Change", e.target.value)
        if(name === 'photo') {
            console.log("handle Change", e.target.files[0])
            setHasPhoto(true);
        }
        
        // if(name === 'photo') {
        //     setPhoto({...photo, [name]: value})
        // }

        setValues({
            ...values,
            [name]: value,
            formData, //since formData is the same name formData: formData
            error: ''
        });
    };

    const handlePhoto = e => {
        // console.log(formData)
        // console.log(e)
        console.log("handle photo")
        setPhoto(e.target.files[0])
        console.log(e)
        console.log(e.target.value)
        console.log(e.target.files)
        
        //setPhoto( e.target.files)
        //setValues({...values, photo: e.target.files[0]})
        console.log("photo useState")
        console.log(photo);
    }

    const handleBody = e => {
        setBody(e);

        //formData.append('body', e);
    };

    const editBlog = (e) => {
        e.preventDefault();
        
        let formData = new FormData();
         
         formData.append("title", values.title);
         formData.append("body", body);
         if(hasPhoto){
            formData.append("photo", photo);//gotta fix this later
            setHasPhoto(!hasPhoto);
         }
         formData.append("categories", checkedCat)
         formData.append("tags", checkedTag)

        //I ended up declaring new FormData in useEffect

        //
        console.log('update blog')
        updateBlog(formData, token, router.query.slug).then(data => {
            if(data.error) {
                setValues({...values, error: data.error})
            } else {
                setValues({...values, title: '', success: `Blog "${data.title}" is successfully updated`})

                //then redirect based on role
                if(isAuth() && isAuth().role === 1){
                    //Router.replace(`${DOMAIN}/admin/crud/${router.query.slug}`)
                    //Router.replace(`${DOMAIN}/blogs`)
                    //Router.reload(`${DOMAIN}/blogs/`)
                    //location.reload();
                    //Router.replace(`${DOMAIN}/blogs/`).then(()=> Router.reload())
                    //Router.replace(`${DOMAIN}/blogs/`);
                    Router.replace(`/admin/`).then(()=> Router.reload())
                    
                } else if(isAuth() && isAuth().role === 0){
                    //Router.replace(`${DOMAIN}/user/crud/${router.query.slug}`)
                    Router.replace(`/user/`)
                }
            }
        })

    };

    const showError = () => {
        return(
            <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
                {error}
            </div>
        )
    }

    const showSuccess = () => {
        return(
            <div className="alert alert-success" style={{display: success ? '' : 'none'}}>
                {success}
            </div>
        )
    }

    const updateBlogForm = () => {
        return (
            <form onSubmit={editBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input type="text" className="form-control" value={title} onChange={handleChange('title')} />
                </div>

                <div className="form-group">
                    <ReactQuill
                        theme="snow"
                        modules={QuillModules}
                        formats={QuillFormats}
                        value={body} placeholder="Write something amazing..."
                        onChange={handleBody} />
                </div>

                <div>
                    <button type="submit" className="btn btn-primary">Update</button>
                </div>

            </form>
        )
    };

    return (
        <div className="container-fluid pb-5">
            <div className="row">
                <div className="col-md-8">
                    {updateBlogForm()}
                    
                    <div className="pt-3">
                        {showSuccess()}
                        {showError()}
                    </div>

                    <div>
                    <h5>Photo Preview:</h5>
                    {body && ( <img src={`${API}/blog/photo/${router.query.slug}`} alt={title} style={{height: "auto" ,width: '100%'}} />)}
                    </div>
                   
                </div>

                <div className="col-md-4">
                    <div>
                        <div className="form-group pb-2">
                            <h5>Featured Image</h5>
                            
                            <hr />
                            <p className="text-muted">Max Size: 1MB</p>
                            <label className="btn btn-outline-info">
                                Upload featured image
                            <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                            </label>

                        </div>
                    </div>
                    <div>
                        <h5>Categories</h5>
                        <hr />
                        <ul style={{ maxHeight: '150px', overflowY: 'scroll' }}>{showCategories()}</ul>

                    </div>
                    <div>
                        <h5>Tags</h5>
                        <hr />
                        <ul style={{ maxHeight: '150px', overflowY: 'scroll' }}>{showTags()}</ul>

                    </div>

                </div>
            </div>



        </div>)
};

export default withRouter(BlogUpdate);