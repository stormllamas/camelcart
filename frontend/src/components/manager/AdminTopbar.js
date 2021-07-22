import React, { Fragment, useEffect } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { logout } from '../../actions/auth';


const Topbar = ({
  auth: { isAuthenticated, userLoading, user },
  logout
}) => {
  const history = useHistory()

  useEffect(() => {
    $(document).ready(function () {
      $('.topbar-links').hide()
  
      $('.collapsible').collapsible({
        accordion: false
      });
    });
  }, [])

  useEffect(() => {
    $(document).ready(function () {
      $('.dropdown-trigger').dropdown();
      if (!userLoading) {
        $('.sidenav').sidenav();
        $('.topbar-links').fadeIn()
      }
    });
  }, [userLoading])
  
  return (
    <Fragment>
      {user && (
        <ul id="mobile-nav" className="sidenav admin-sidenav">
          {user.groups.includes('partner') || user.is_staff ? (
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
          ) : undefined}
          <li>
            <Link to="/" className="sidenav-close waves-effect"><i className="material-icons">home</i>Return to Home Page</Link>
          </li>
          {user.is_staff && (
            <li className={history.location.pathname === "/admin/dashboard" ? "active" : ""}>
              <Link to="/admin/dashboard" className="sidenav-close waves-effect"><i className="material-icons">dashboard</i>Dashboard</Link>
            </li>
          )}
          {user.groups.includes('rider') || user.is_staff ? (
            <Fragment>
              <li>
                <div className="divider"></div>
              </li>
              <li>
                <a className="subheader">Order Manager Pages</a>
              </li>
              <li className={history.location.pathname === "/order_manager/unclaimed" ? "active" : ""}>
                <Link to="/order_manager/unclaimed" className="sidenav-close waves-effect" ><i className="material-icons">pending</i>Unclaimed Orders</Link>
              </li>
              <li className={history.location.pathname === "/order_manager/claimed" ? "active" : ""}>
                <Link to="/order_manager/claimed" className="sidenav-close waves-effect" ><i className="material-icons">pending_actions</i>Claimed Orders</Link>
              </li>
              <li className={history.location.pathname === "/order_manager/undelivered" ? "active" : ""}>
                <Link to="/order_manager/undelivered" className="sidenav-close waves-effect" ><i className="material-icons">local_shipping</i>Undelivered Orders</Link>
              </li>
              <li className={history.location.pathname === "/order_manager/delivered" ? "active" : ""}>
                <Link to="/order_manager/delivered" className="sidenav-close waves-effect" ><i className="material-icons">check_box</i>Delivered Orders</Link>
              </li>
            </Fragment>
          ): undefined}
          {user.groups.includes('seller') && (
            <Fragment>
              <li>
                <div className="divider"></div>
              </li>
              <li>
                <a className="subheader">Seller Manager Pages</a>
              </li>
              <li className={history.location.pathname === "/seller_dashboard" ? "active" : ""}>
                <Link to="/seller_dashboard" className="sidenav-close waves-effect" ><i className="material-icons">dashboard</i>Seller Dashboard</Link>
              </li>
              <li className={history.location.pathname === "/seller_manager/new_orders" ? "active" : ""}>
                <Link to="/seller_manager/new_orders" className="sidenav-close waves-effect" ><i className="material-icons">pending</i>New Orders</Link>
              </li>
              <li className={history.location.pathname === "/seller_manager/prepared_orders" ? "active" : ""}>
                <Link to="/seller_manager/prepared_orders" className="sidenav-close waves-effect" ><i className="material-icons">pending_actions</i>Prepared Orders</Link>
              </li>
            </Fragment>
          )}
          <li>
            <div className="divider"></div>
          </li>
          <li>
            <a className="subheader">Account Controls</a>
          </li>
          <li>
            <Link to="/profile" className="sidenav-close waves-effect" ><i className="material-icons">account_circle</i>My Profile</Link>
          </li>
          <li>
            <Link to="/security" className="sidenav-close waves-effect" ><i className="material-icons">security</i>Security</Link>
          </li>
          <li className="mb-5">
            <a className="sidenav-close waves-effect" onClick={() => logout()}><i className="material-icons">logout</i>Logout</a>
          </li>
        </ul>
      )}
    </Fragment>
  )
}

Topbar.propTypes = {
  logout: PropTypes.func.isRequired,
  // setFilterToggled: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  // filterOpened: state.products.filterOpened,
  // profileOpened: state.layout.profileOpened,
  // siteConfig: state.siteConfig
});

export default connect(mapStateToProps, { logout })(Topbar);