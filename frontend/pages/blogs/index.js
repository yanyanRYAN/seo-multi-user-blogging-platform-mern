// this will show as /blogs/ in url 
// because index.js is the default pointer for the directory

import Head from 'next/head' // for meta title, desc, urls, etc
import Link from 'next/link'
import { withRouter } from 'next/router'
import Layout from '../../components/Layout'
import React, { useState } from 'react'
import { listBlogsWithCategoriesAndTags } from '../../actions/blog'
//import { API } from '../../config'
import renderHTML from 'react-render-html'
import moment from 'moment' //use for formatting the date
import Card from '../../components/blog/Card'
import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config'

const Blogs = ({ blogs, categories, tags, totalBlogs, blogsLimit, blogsSkip, router }) => {
    const head = () => (
        <Head>
            <title>Weeb Blogs | {APP_NAME}</title>
            <meta
                name="description"
                content="Random blogs from random weebs" />
            <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
            <meta
                property="og:title"
                content={`Latest weeb blogs | ${APP_NAME}`}
            />
            <meta property="og:description" content="Random blogs from random weebs" />

            <meta property="og:type" content="website" />

            <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />

            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${DOMAIN}/static/images/nakamagarage.jpg`} />
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/nakamagarage.jpg`} />
            <meta property="og:image:type" content="image/jpg" />
            <meta property="fb:app_id" content={`${FB_APP_ID}`} />

        </Head>
    )

    const [limit, setLimit] = useState(blogsLimit);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(totalBlogs);
    const [loadedBlogs, setLoadedBlogs] = useState([]);

    const loadMore = () => {
        let toSkip = skip + limit; //sets amount to load 0 + 2

        listBlogsWithCategoriesAndTags(toSkip, limit).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setLoadedBlogs([...loadedBlogs, ...data.blogs])
                setSize(data.size)
                setSkip(toSkip);
            }
        });

    };

    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit && (<button onClick={loadMore} className="btn btn-primary btn-lg">Load more</button>)
        )
    }



    const showAllCategories = () => (
        categories.map((c, i) => (
            (
                <Link href={`/categories/${c.slug}`} key={i}>
                    <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
                </Link>
            )

        ))
    )

    const showAllTags = () => {
        return tags.map((t, i) => {
            return (
                <Link href={`/tags/${t.slug}`} key={i}>
                    <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
                </Link>
            )
        })
    }

    const showAllBlogs = () => {
        return blogs.map((blog, index) => {
            //output each blog as an article element
            return (
                <article key={index}>
                    <Card blog={blog} />
                    <hr />
                </article>
            )
        })
    }

    const showLoadedBlogs = () => {
        return loadedBlogs.map((blog, index) => {
            return (
                <article key={index}>
                    <Card blog={blog} />
                </article>
            )
        })
    }

    return (
        <React.Fragment>
            {head()}
            {console.log(router)}
            <Layout>
                <main>
                    <div className="container-fluid">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-4 font-weight-bold text-center">Blogs from a weeb</h1>
                            </div>
                            <section>
                                <div className="pb-5 text-center">
                                    {showAllCategories()}
                                    {showAllTags()}
                                </div>

                            </section>

                        </header>
                    </div>
                    <div className="container-fluid">
                        {showAllBlogs()}

                    </div>
                    <div className="container-fluid">
                        {showLoadedBlogs()}

                    </div>
                    <div className="text-center pt-5 pb-5">
                        {loadMoreButton()}
                    </div>
                </main>
            </Layout>
        </React.Fragment>
    )
}

//getInitialProps is a nextJS lifecycle method that is 
// not available in Components, ONLY pages
//use getServerSideProps instead since we are using later version of nextjs
// Blogs.getInitialProps = () => {
//     //initial values for pagenation
//     let skip = 0; // setting this to higher than 1 will skip the latest blog on init
//     let limit = 5; // setting the limit for each load

//     return listBlogsWithCategoriesAndTags(skip, limit).then(data => {
//         if (data.error) {
//             console.log(data.error)
//         } else {
//             return {
//                 blogs: data.blogs,
//                 categories: data.categories,
//                 tags: data.tags,
//                 totalBlogs: data.size,
//                 blogsLimit: limit,
//                 blogSkip: skip
//             };
//         }
//     })
// }

export const getServerSideProps = async () => {
    let skip = 0;
    let limit = 5;

    return listBlogsWithCategoriesAndTags(skip, limit).then(data => {
        if (data.error) {
            console.log(data.error)
        } else {
            return {
                props: {
                    blogs: data.blogs,
                    categories: data.categories,
                    tags: data.tags,
                    totalBlogs: data.size,
                    blogsLimit: limit,
                    blogSkip: skip
                }
            }
        }
    })
}

export default withRouter(Blogs);
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
