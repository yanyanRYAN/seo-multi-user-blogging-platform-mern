import React, { useState } from 'react';
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

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">

        <Link href="/"><NavLink className="font-weight-bold">{APP_NAME}</NavLink></Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
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
            </NavItem>)}

          </Nav>

        </Collapse>
      </Navbar>
    </div>
  );

}



export default Header;