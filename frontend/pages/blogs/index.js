// this will show as /blogs/ in url 
// because index.js is the default pointer for the directory

import Head from 'next/head' // for meta title, desc, urls, etc
import Link from 'next/link'
import Layout from '../../components/Layout'
import React, {useState} from 'react'
import {listBlogsWithCategoriesAndTags} from '../../actions/blog'
import {API} from '../../config'

const Blogs = () => {
    return (
        
            <Layout>
                <main>
                    <div className="container-fluid">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold text-center">Blogs from a weeb</h1>
                            </div>
                            <section>
                                <p>show categories and tags</p>
                            </section>

                        </header>
                    </div>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">show all blogs</div>
                        </div>
                    </div>
                </main>
            </Layout>
        
    )
}

export default Blogs; 
/* This page will be server side rendered
will be using a method given by nextJS
called getInitialProps

this method runs on the server side, gets the response from 
the server and then render the page

so when this page is rendered for the first time, it is
fully server side render.

So when we click around the navigation on this page it will
only happen on client side.  So it will be extremely fast.

But on the first load it will load from the server and wait for
server response
*/ 
