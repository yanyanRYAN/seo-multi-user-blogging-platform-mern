import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import { getCookie, isAuth } from '../../actions/auth'
import { list, removeBlog } from '../../actions/blog'
import moment from 'moment';

const BlogRead = () => {

    const[blogs, setBlogs] = useState([])
    const[message, setMessage] = useState('')
    const token = getCookie('token')

    useEffect(() => {
        loadBlogs()
    },[])

    const loadBlogs = () => {
        list().then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                setBlogs(data);
            }
        })
    }

    const deleteBlog = (slug) => {
        removeBlog(slug, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                setMessage(data.message)
                loadBlogs();
            }
        })
    }

    const deleteConfirm = (slug) => {
        let answer = window.confirm(`Are you usre you want to delete this blog?`)
        if(answer) {
            deleteBlog(slug)
        }
    }

    const showAllBlogs = () => {
        return blogs.map((blog, index) => {
            return (
                <div key={index} className="mt-3 pb-3">
                    <h3>{blog.title}</h3>
                    <p className="mark">
                        Written by {blog.postedBy.name} | Published on {moment(blog.updatedAt).fromNow()}
                    </p>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteConfirm(blog.slug)}>Delete</button>
                </div>
            )
        })
    }


    return (
        <React.Fragment>
            
                <div className="row">
                    <div className="col-md-12">
                        {message && <div className="alert alert-warning">{message}</div> }
                        {showAllBlogs()}
                    </div>
                    
                </div>
            
        </React.Fragment>
    )
}

export default BlogRead;