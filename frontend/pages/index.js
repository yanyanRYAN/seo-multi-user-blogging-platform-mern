import Layout from '../components/Layout'
import Link from 'next/link'
import { APP_NAME } from '../config';


const Index = () => {

    
    
    return (
        <Layout hideSearch="false">
        
            <article className="overflow-hidden">
                {/* <div>
                    <section>
                        <img className="home-image" src={`/static/images/NakamaSpeed.png`} />
                    </section>
                </div> */}
                <div className="jumbotron jumbotron-fluid home-jumbotron-image">
                    <div className="container">
                        <h1 className="display-4 text-light font-weight-bold">{APP_NAME}</h1>
                        <p className="lead text-light">Random blogs from random dweebs</p>
                        <hr className="my-4"></hr>
                        <p className="lead">
                            <a className="btn btn-outline-light btn-lg" href="/blogs" role="button">Check 'Em</a>
                        </p>
                    </div>
                </div>


                <div className="container">
                    <div className="text-center">
                        
                    </div>
                </div>



            </article>

            <Link href="/signup"><a>Signup</a></Link>

        </Layout>
    )
};

export default Index;