import Head from 'next/head' // for meta title, desc, urls, etc
import Link from 'next/link'
import { withRouter } from 'next/router'
import Layout from '../../components/Layout'
import React, { useEffect, useState } from 'react'
import { singleCategory } from '../../actions/category'
//import { API } from '../../config'
import renderHTML from 'react-render-html'
import moment from 'moment' //use for formatting the date
import Card from '../../components/blog/Card'

import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config'

//server side rendered
const Category = ({category, blogs}) => {

    return(
        <React.Fragment>
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold">{category.name}</h1>
                                {blogs.map((blog, index) => (
                                    <div>                                       
                                        <Card key={index} blog={blog} />
                                        <hr />
                                    </div>
                                    
                                ))}
                            </div>
                        </header>
                    </div>
                </main>
            </Layout>
        </React.Fragment>
    );
};

Category.getInitialProps = ({query}) => {
    return singleCategory(query.slug).then(data => {
        if(data.error) {
            console.log(data.error);
        } else {
            return {category: data.category, blogs: data.blogs};
        }
    });
};

export default Category;