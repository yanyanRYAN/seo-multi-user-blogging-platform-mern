import Link from 'next/link';
import React, {useState, useEffect} from 'react'
import Router from 'next/router'
import dynamic from 'next/dynamic' /*used with react quill as rich text editor, only runs in 
client side.  since next js runs both client and server side. this component makes sure we do not use
server side rendering.  Import this so that SSR is false
*/
import {withRouter} from 'next/router' //allows us to use router like react with props.  {router} props
import {getCookie, isAuth} from '../../actions/auth'
import {getCategories} from '../../actions/category' //get categories and tags
import {getTags} from '../../actions/tag'
import {createBlog} from '../../actions/blog'

const ReactQuill = dynamic(() => import('react-quill'), {ssr: false})
import '../../node_modules/react-quill/dist/quill.snow.css'

const CreateBlog = ({router}) => {
    return <div>
        <h2>Create blog form</h2>
        {JSON.stringify(router)}
    </div>
}

export default withRouter(CreateBlog);