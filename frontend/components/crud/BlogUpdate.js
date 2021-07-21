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

const BlogUpdate = () => {

    return <div className="container-fluid pb-5">
        <div className="row">
            <div className="col-md-8">
                <p>create blog form</p>
                <div className="pt-3">
                    show success and error msg
                </div>


            </div>

            <div className="col-md-4">
                <div>
                    <div className="form-group pb-2">
                        <h5>Featured Image</h5>
                        

                    </div>
                </div>
        

            </div>
        </div>



    </div>
}

export default BlogUpdate;