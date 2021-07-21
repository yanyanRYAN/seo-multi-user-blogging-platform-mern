import Link from 'next/link'
import renderHTML from 'react-render-html'
import moment from 'moment' //use for formatting the date
import { API } from '../../config'

const SmallCard = ({ blog }) => {

    return (
        <div className="card">
            <section>
                <Link href={`/blogs/${blog.slug}`}>
                    <a>
                        <img className="img img-fluid "
                            style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                            src={`${API}/blog/photo/${blog.slug}`}
                            alt={blog.title}
                        />
                    </a>
                </Link>
            </section>

            <div className="card-body h-100">
                <section>
                    <Link href={`/blogs/${blog.slug}`}>
                        <a>
                            <h5 className="card-title">{blog.title}</h5>
                        </a>
                    </Link>
                    <div className="card-text">{blog.excerpt == undefined ? ' ' : renderHTML(blog.excerpt)}</div>
                </section>
            </div>

            <div className="card-body">
                <div>
                    Posted {moment(blog.updatedAt).fromNow()} by {' '}
                    <Link href={`/`}>
                        <a className="float-right">{blog.postedBy.name}</a>
                    </Link>
                </div>

            </div>

        </div>

    )
}

export default SmallCard;