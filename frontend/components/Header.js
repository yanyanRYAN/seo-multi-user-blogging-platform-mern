import React, { useState } from 'react';
import NProgress from 'nprogress';
import { APP_NAME } from '../config';
import Link from 'next/link';
import { signout, isAuth } from '../actions/auth'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';
import Router from 'next/router';
import Search from './blog/Search'

//NProgress bar loading animations
Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(false);

  const toggleSearch = () => setSearch(!search);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <React.Fragment>
      <Navbar color="light" light expand="md">

        <Link href="/"><NavLink className="font-weight-bold">{APP_NAME}</NavLink></Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {
              <NavItem style={{ cursor: 'pointer' }}>
                <NavLink onClick={() => toggleSearch()}>Search</NavLink>
              </NavItem>
            }
            
            {
              <React.Fragment>
                <NavItem>
                  <Link href="/blogs"><NavLink style={{ cursor: 'pointer' }}>Blogs</NavLink></Link>
                </NavItem>
              </React.Fragment>
            }
            {
              <React.Fragment>
                <NavItem>
                  <Link href="/contact"><NavLink style={{ cursor: 'pointer' }}>Contact</NavLink></Link>
                </NavItem>
              </React.Fragment>
            }

            {
              (isAuth() && isAuth().role == 1) ? <React.Fragment><NavItem>
                <Link href="/admin"><NavLink style={{ cursor: 'pointer' }}>{`${isAuth().name}'s`} Dashboard</NavLink></Link>
              </NavItem></React.Fragment> : (isAuth() && isAuth().role == 0) ? <React.Fragment><NavItem>
                <Link href="/user"><NavLink style={{ cursor: 'pointer' }}>{`${isAuth().name}'s`} Dashboard</NavLink></Link>
              </NavItem></React.Fragment> : null
            }

            {
              !isAuth() && <React.Fragment>
                <NavItem>
                  <Link href="/signin"><NavLink style={{ cursor: 'pointer' }}>Signin</NavLink></Link>
                </NavItem>
                <NavItem>
                  <Link href="/signup"><NavLink style={{ cursor: 'pointer' }}>Signup</NavLink></Link>
                </NavItem>
              </React.Fragment>
            }
            {
              //JSON.stringify(isAuth())
            }
            {isAuth() && (<NavItem>
              <NavLink style={{ cursor: 'pointer' }} onClick={() => signout(() => Router.replace('/signin'))}>Signout</NavLink>
            </NavItem>)
            }
            {
             isAuth() && (<React.Fragment>
                <NavItem>
                  <Link href="/user/crud/blog"><NavLink className="btn btn-primary text-light" style={{ cursor: 'pointer' }}>Create Blog</NavLink></Link>
                </NavItem>
              </React.Fragment>)
            }

          </Nav>

        </Collapse>
      </Navbar>
      {
        search && <Search />
      }
    </React.Fragment>
  );

}



export default Header;