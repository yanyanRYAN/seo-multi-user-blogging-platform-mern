import Layout from '../../components/Layout'
import Private from '../../components/auth/Private'
import Link from 'next/link'

const UserIndex = () => {
    return (
        <Layout>
            <Private>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>User Dashboard</h2>
                        </div>
                        <div className="col-md-4">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    {
                                        // since the css might not load sometimes for the text editor
                                        // we use <a> to link to the page so it can reload the page
                                    }
                                    <a href="/user/crud/blog">Create Blog</a>

                                </li>
                                <li className="list-group-item">
                                    <Link href="/user/crud/blogs">
                                        <a>Update/Delete Blogs</a>
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link href="/user/update">
                                        <a>Update profile</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-8">
                            right
                        </div>
                    </div>
                </div>

            </Private>



        </Layout>
    )
};

export default UserIndex;