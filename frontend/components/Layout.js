import React from 'react'; //have to import react on nextJS 10.0.4+
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <React.Fragment>
            <div id="page-container">
                <Header />
                <div id="content-wrap">
                    {children}
                </div>

                <Footer />
            </div>

        </React.Fragment>
    )
}

export default Layout;