import Layout from '../components/Layout'
import Link from 'next/link'
import { APP_NAME } from '../config';
import { urlObjectKeys } from 'next/dist/next-server/lib/utils';

const styles = {
    
    "background-position" : "center",
    "height" : "15vw",
    "width" : "100%",
    "object-fit" : "cover",
    "opacity" : '50%'
}

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
                        <h1 className="display-4 text-light font-weight-bold mt-4">{APP_NAME}</h1>
                        <p className="lead text-light">Random blogs from random dweebs</p>
                        <hr className="my-4"></hr>
                        {/* <p className="lead">
                            <a className="btn btn-outline-light btn-lg" href="/blogs" role="button">Check 'Em</a>
                        </p> */}
                    </div>
                </div>


                <div className="container">
                    <div className="row justify-content-between">
                        {/* <div className="col-md-8 offset-4" style={{backgroundColor:'grey', backgroundImage: "url(" + "/static/images/nakamagarage.jpg" + ")"}}>
                                sup
                            </div> */}
                        <div className="col-md-5 mt-4">
                            <div className="card bg-dark text-white">
                                <img className="card-img" style={styles} src="/static/images/front-page/rimukoro.png" alt="Card image" />
                                <div className="card-img-overlay">
                                    <h5 className="card-title">Signin</h5>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5 mt-4">
                            <div className="card bg-dark text-white">
                                <img className="card-img" style={styles} src="/static/images/front-page/dongho-kang.jpg" alt="Card image" />
                                <div className="card-img-overlay">
                                    <h5 className="card-title">Read Blogs</h5>
                                    
                                </div>
                            </div>
                        </div>
                            
                    </div>
                    <div className="row justify-content-center">
                    <div className="col-md-6 mt-4">
                            <div className="card bg-dark text-white">
                                <img className="card-img" style={styles} src="/static/images/front-page/fasces.jpg" alt="Card image" />
                                <div className="card-img-overlay">
                                    <h5 className="card-title">Write Blogs</h5>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



            </article>

            

        </Layout>
    )
};

export default Index;