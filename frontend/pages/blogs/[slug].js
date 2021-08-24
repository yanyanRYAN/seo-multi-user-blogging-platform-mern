import Head from 'next/head' // for meta title, desc, urls, etc
import Link from 'next/link'
import { withRouter } from 'next/router'
import Layout from '../../components/Layout'
import React, { useEffect, useState } from 'react'
import { singleBlog, listRelated } from '../../actions/blog'
//import { API } from '../../config'
import renderHTML from 'react-render-html'
import moment from 'moment' //use for formatting the date
import SmallCard from '../../components/blog/SmallCard'

import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config'


//DISQUS THREAD IMPORT
import DisqusThread from '../../components/DisqusThread'

const SingleBlog = ({ blog, router, query }) => {
    //grab router query 
    //JSON.stringify(router)

    const [related, setRelated] = useState([])

    const loadRelated = () => {
        listRelated({ blog }).then(data => {
            if (data.error) {
                console.log(data.error)
            } else {
                setRelated(data);
            }
        })
    }

    useEffect(() => {
        loadRelated();
    }, [query])

    const head = () => (
        <Head>
            <title>{blog.title} | {APP_NAME}</title>
            <meta
                name="description"
                content={blog.mdesc} />
            <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />
            <meta
                property="og:title"
                content={`${blog.title} | ${APP_NAME}`}
            />
            <meta property="og:description" content={blog.mdesc} />

            <meta property="og:type" content="website" />

            <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />

            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
            <meta property="og:image:secure_url" content={`${API}/blog/photo/${blog.slug}`} />
            <meta property="og:image:type" content="image/jpg" />
            <meta property="fb:app_id" content={`${FB_APP_ID}`} />

        </Head>
    )

    const showBlogCategories = blog => (
        blog.categories.map((c, index) => (
            <Link key={index} href={`/categories/${c.slug}`}>
                <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
            </Link>
        ))
    )

    const showBlogTags = blog => (
        blog.tags.map((t, index) => (
            <Link key={index} href={`/categories/${t.slug}`}>
                <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
            </Link>
        ))
    )

    const showRelatedBlogs = () => {
        return related.map((blog, index) => (
            <div className="col-md-4" key={index}>
                <article>
                    <SmallCard blog={blog} />
                </article>
            </div>
        ))
    }

    const showComments = () => {
        return (
            <div>
                <DisqusThread id={blog.id} title={blog.title} path={`/blog/${blog.slug}`} />
            </div>
        )
    }

    return <React.Fragment>
        {head()}
        <Layout>
            <main>
                <article>
                    <div className="container-fluid">
                        <section>
                            <div className="row" style={{ marginTop: '-30px' }}>
                                <img src={`${API}/blog/photo/${blog.slug}`} alt={blog.title} className="img img-fluid featured-image" />
                            </div>
                        </section>

                        <section>
                            <div className="container">
                                <h1 className="display-3 pb-3 pt-3 text-center ">{blog.title}</h1>
                                <p className="lead mt-3 mark">Written by <Link href={`/profile/${blog.postedBy.username}`}><a>{blog.postedBy.username}</a></Link>  | Published {moment(blog.updatedAt).fromNow()}</p>

                                <div className="pb-3">
                                    {showBlogCategories(blog)}
                                    {showBlogTags(blog)}
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="container">
                        <section>
                            <div className="col-md-12 lead text-wrap text-break">{renderHTML(blog.body)}</div>
                        </section>
                    </div>

                    <div className="container pb-5">
                        <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
                        <hr />
                        <div className="">
                            <div className="card-deck h-100">
                                {showRelatedBlogs()}
                            </div>
                        </div>
                    </div>
                    
                    <div className="container pt-5 pb-5">
                    <hr />
                        {showComments()}
                    </div>
                </article>
            </main>
        </Layout>
    </React.Fragment>
}

// SingleBlog.getInitialProps = ({ query }) => {
//     return singleBlog(query.slug).then(data => {
//         if (data.error) {
//             console.log(data.error)
//         } else {
//             // console.log("GET INITIAL PROPS SINGLEBLOG")
//             // console.log(data)
//             // console.log(query)
//             return { blog: data, query }
//         }
//     })
// }
// use getServerSideProps
export const getServerSideProps = async({query}) => {
    return singleBlog(query.slug)
    .then((data) => {
        if( data.error) {
            console.log(data.error)
        } else {
            return {
                props: {blog: data, query}
            }
        }
    })
}



export default withRouter(SingleBlog);