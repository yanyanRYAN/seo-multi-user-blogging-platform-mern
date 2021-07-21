import Link from 'next/link'
import renderHTML from 'react-render-html'
import moment from 'moment' //use for formatting the date
import { API } from '../../config'

const SmallCard = ({ blog }) => {
    //Future plans will be to implement html sanitiation 

    //let cleanExcerpt = blog.excerpt.replace(/&nbsp;/g, " ");
    //console.log("clean Excerpt", cleanExcerpt)

    return (
        <div className="card h-100" style={{}}>

            <div className="">
                <Link href={`/blogs/${blog.slug}`}>
                    <a>
                        <img className="img img-fluid "
                            style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                            src={`${API}/blog/photo/${blog.slug}`}
                            alt={blog.title}
                        />
                    </a>
                </Link>
                <div className="">
                    <div className="card-body ">
                    <Link href={`/blogs/${blog.slug}`}>
                        <a>
                            <h5 className="card-title">{blog.title}</h5>
                        </a>
                    </Link>
                    <div className="">{blog.excerpt == undefined ? ' ' : renderHTML(blog.excerpt)}</div>
                    </div>
                    <div class="card-footer text-muted">
                        Posted {moment(blog.updatedAt).fromNow()} by {' '}
                        <Link href={`/`}>
                            <a className="float-right">{blog.postedBy.name}</a>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SmallCard;