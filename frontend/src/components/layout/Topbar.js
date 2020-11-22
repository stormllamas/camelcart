import React, { Fragment, useEffect } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { logout } from '../../actions/auth';


const Topbar = ({
  auth: { isAuthenticated, userLoading, user },
  logout,
}) => {
  const history = useHistory()

  useEffect(() => {
    $('.topbar-links').hide()

    $('.collapsible').collapsible({
      accordion: false
    });
  }, [])

  useEffect(() => {
    $('.dropdown-trigger').dropdown();
    if (!userLoading) {
      $('.sidenav').sidenav();
      $('.topbar-links').fadeIn()
    }
  }, [userLoading])
  
  return (
    <Fragment>
      <div className="navbar-fixed">
        <nav id="topbar" className="white">
          <div className="container">
            <div className="nav-wrapper">
              <div className="brand-logo"><Link to="/" className="valign-wrapper"><img src="/static/frontend/img/Trike_logo-whole.png" alt="trike logo" className="responsive-img"/></Link></div>
              <a href="#" data-target="mobile-nav" className="sidenav-trigger waves-effect show-on-large grey-text text-darken-2 show-on-small-and-up menu-wrapper relative">
                <i className="material-icons">menu</i>
                {!userLoading && (
                  user && (
                    user.menu_notification && (
                      <div className="menu-notification red rad-5"></div>
                    )
                  )
                )}
              </a>
              {!userLoading && isAuthenticated ? (
                <ul className="right topbar-links">
                  <li className="waves-effect hide-on-med-and-down"><a className="grey-text text-darken-2">Help Center</a></li>
                  <li className="waves-effect hide-on-med-and-down"><a className="grey-text text-darken-2 dropdown-trigger" data-target="partner-dropdown">Be Our Partner<i className="material-icons">keyboard_arrow_down</i></a></li>
                  {/* <li className="waves-effect"><Link to="/profile" className="grey-text text-darken-2">{user.first_name} {user.last_name}</Link></li> */}
                </ul>
              ) : (
                <ul className="right topbar-links">
                  <li className={history.location.pathname.includes('login') ? "active" : ''}><Link to="/login" className="grey-text text-darken-2">Login</Link></li>
                  <li className={history.location.pathname.includes('signup') ? "active" : ''}><Link to="/signup" className="grey-text text-darken-2 hide-on-med-and-down">Signup</Link></li>
                </ul>
              )}
              <ul className="dropdown-content" id="partner-dropdown">
                <li><Link to="/rider_inquiry" className="sidenav-close grey-text text-darken-1">Rider</Link></li>
                <li><Link to="#!" className="sidenav-close grey-text text-darken-1">Food Merchant</Link></li>
                {/* <li><a href="" className="grey-text text-darken-1">Delivery Partner</a></li>
                <li><a href="" className="grey-text text-darken-1">Purchase Merchant</a></li> */}
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <ul id="mobile-nav" className="sidenav">
        {user ? (
          user.groups.includes('rider') || user.groups.includes('admin') ? (
            <li>
              <div className="user-view">
                <div className="background orange darken-1 p-0">
                  {/* <img src="https://source.unsplash.com/random/800x600/?wave" className="responsive-img" alt=""/> */}
                </div>
                <Link to="/profile">
                  {user.picture ? (
                    <img src={user.picture} alt="" className="sidenav-close circle"/>
                  ) : (
                    <img src="/static/frontend/img/user.jpg" alt="" className="sidenav-close circle"/>
                  )}
                </Link>
                <span className="name white-text">{user ? (user.first_name + ' ' + user.last_name) : ''}</span>
                <span className="email white-text">{user ? (user.email) : ''}</span>
              </div>
            </li>
          ) : (
            <li>
              <div className="user-view mb-5">
                <div className="flex-col center">
                  <img src="/static/frontend/img/Trike_logo-whole.png" alt="trike logo" className="responsive-img" style={{ height:"30px" }}/>
                </div>
              </div>
            </li>
          )
        ) : (
          <li>
            <div className="user-view mb-5">
              <div className="flex-col center">
                <img src="/static/frontend/img/Trike_logo-whole.png" alt="trike logo" className="responsive-img" style={{ height:"30px" }}/>
              </div>
            </div>
          </li>
        )}
        <li className={history.location.pathname === "/" ? "active" : ""}>
          <Link to="/" className="sidenav-close waves-effect"><i className="material-icons">home</i>Home</Link>
        </li>
        {!userLoading && isAuthenticated ? (
          <Fragment>
            {!user.groups.includes('rider') && (
              <li className={history.location.pathname.includes('bookings') ? "active" : ''}>
                <Link to="/bookings" className="sidenav-close waves-effect" ><i className="material-icons">assignment</i>My Bookings</Link>
              </li>
            )}
            {user.groups.includes('rider') || user.groups.includes('admin') ? (
              <li>
                <Link to="/order_manager/unclaimed" className="sidenav-close waves-effect" ><i className="material-icons">fact_check</i>Order Manager</Link>
              </li>
            ) : undefined}
          </Fragment>
        ) : undefined}
        {/* <li>
          <a className="sidenav-close waves-effect" ><i className="material-icons">gps_not_fixed</i>Track Package</a>
        </li> */}
        <div id="sidenav-collaborate" className={!userLoading && isAuthenticated ? "hide-on-large-only" : ""}>
          <li>
            <div className="divider"></div>
          </li>
          <li>
            <a className="subheader">Collaborate</a>
          </li>
          <li>
            <ul className="collapsible">
              <li>
                <div className="collapsible-header">
                  <i className="material-icons">expand_more</i>Be Our Partner
                </div>
                <div className="collapsible-body">
                  <ul>
                    <li><Link to="/rider_inquiry" className="sidenav-close grey-text text-darken-1">Rider</Link></li>
                    <li><Link to="#!" className="sidenav-close grey-text text-darken-1">Food Merchant</Link></li>
                    {/* <li><a href="#!" className="sidenav-close grey-text text-darken-1">Personal Shopper</a></li>
                    <li><a href="#!" className="sidenav-close grey-text text-darken-1">Delivery Partner</a></li> */}
                  </ul>
                </div>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/contact" className="sidenav-close waves-effect" ><i className="material-icons">help</i>Ask a question</Link>
          </li>
        </div>
        {!userLoading && isAuthenticated ? (
          <Fragment>
            <li>
              <div className="divider"></div>
            </li>
            <li>
              <a className="subheader">Account Controls</a>
            </li>
            <li className={history.location.pathname.includes('profile') ? "active" : ''}>
              <Link to="/profile" className="sidenav-close waves-effect" ><i className="material-icons">account_circle</i>My Profile</Link>
            </li>
            <li className={history.location.pathname.includes('security') ? "active" : ''}>
              <Link to="/security" className="sidenav-close waves-effect" ><i className="material-icons">security</i>Security</Link>
            </li>
            <li>
              <a className="sidenav-close waves-effect" onClick={() => logout()}><i className="material-icons">logout</i>Logout</a>
            </li>
          </Fragment>
        ) : undefined}
      </ul>
    </Fragment>
  )
}

Topbar.propTypes = {
  logout: PropTypes.func.isRequired,
  // setFilterToggled: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig
});

export default connect(mapStateToProps, { logout })(Topbar);