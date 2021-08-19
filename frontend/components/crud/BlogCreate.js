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
import { createBlog } from '../../actions/blog'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import '../../node_modules/react-quill/dist/quill.snow.css'
import {QuillModules, QuillFormats} from '../../helpers/quill'

const BlogCreate = ({ router }) => {
    // blogFromLS will cause issues on some computers 
    // const blogFromLS = () => {
    //     // if (typeof window === 'undefined') {
    //     //     return false
    //     // }

    //     if (localStorage.getItem('blog')) {
    //         /*
    //             since we stored the blog item in localstorage as a Stringified JSON string
    //             we want to parse it back into a javascript object
    //         */
    //         return JSON.parse(localStorage.getItem('blog'))
    //     } else {
    //         return false;
    //     }
    // }

    const [body, setBody] = useState();
    const [values, setValues] = useState({
        error: '',
        success: '',
        formData: '',
        title: '',
        body: '',
        photo: ''
    });

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const [checkedCat, setCheckedCat] = useState([]) //categories
    const [checkedTag, setCheckedTag] = useState([]) //tags

    const [hasPhoto, setHasPhoto] = useState(false);

    const token = getCookie('token');

    const { error, success, formData, title, photo } = values;

    const initCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setCategories(data)
            }
        })
    }

    const initTags = () => {
        getTags().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setTags(data)
            }
        })
    }

    useEffect(() => {
        //setValues({...values, formData: new FormData() }) //when component mounts we have FormData ready to use
        setValues({...values})
        initCategories()
        initTags()
    }, [router]) // [router] instance comes from withRouter

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
        console.log("handle change photo" , photo)
    };

    const handleBody = e => {
        setBody(e);

        //formData.append('body', e);
        // if (typeof window !== 'undefined') {
        //     localStorage.setItem('blog', JSON.stringify(e))
        // }
    };

    const publishBlog = (e) => {
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
        console.table(formData)
        console.log('update blog')
        console.table(values);
        createBlog(formData, token).then(data => {
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
                    //Router.replace(`/admin/`).then(()=> Router.reload())
                    
                } else if(isAuth() && isAuth().role === 0){
                    //Router.replace(`${DOMAIN}/user/crud/${router.query.slug}`)
                    Router.replace(`/user/`)
                }
            }
        })

    };

    const createBlogForm = () => {
        return (
            <form onSubmit={publishBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input type="text" className="form-control" value={title} onChange={handleChange('title')} />
                </div>

                <div className="form-group">
                    <ReactQuill
                        theme="snow"
                        modules={QuillModules}
                        formats={QuillFormats}
                        value={body || ''} placeholder="Write something amazing..."
                        onChange={handleBody} />
                </div>

                <div>
                    <button type="submit" className="btn btn-primary">Publish</button>
                </div>

            </form>
        )
    }

    const showCategories = () => {
        return (
            //logical predicates -- if categories exists then we will map
            categories && categories.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleCatToggle(c._id)} type="checkbox" className="mr-2" />
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
                    <input onChange={handleTagToggle(t._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{t.name}</label>
                </li>

            ))
        )
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

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-md-8">
                    {createBlogForm()}
                    
                    <div className="pt-3">
                        {showSuccess()}
                        {showError()}
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
        </React.Fragment>
    )
}

export default withRouter(BlogCreate);