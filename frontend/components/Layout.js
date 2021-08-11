import React from 'react'; //have to import react on nextJS 10.0.4+
import Header from './Header';

const Layout = ({children}) =>{
    return(
        <React.Fragment>
            <Header />
                {children}
            
        </React.Fragment>
    )
}

export default Layout;