import React, { Fragment, useEffect } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
// import { logout } from '../../actions/auth';


const Footer = ({
  auth: {isAuthenticated, user, userLoading },
  // siteConfig: { maintenanceMode, betaMode },
  // profileOpened, logout, setMobileMenu, setFilterToggled
}) => {
  const history = useHistory()

  useEffect(() => {
    // $(document).ready(function () {
    //   $('.sidenav').sidenav({});
    // });
  }, [])
  
  if (0 === 1) {
    return <Fragment></Fragment>
  } else {
    return (
      <footer className="page-footer orange mt-5">
        <div className="container">
          <div className="row">
            <div className="col s12 m6 l3">
              <h5 className="grey-text text-lighten-3">Customer Service</h5>
              <ul>
                <li>
                  <Link to="/contact" className="white-text">Contact support</Link>
                </li>
                <li>
                  <Link to="/questions/delivery_guide" className="white-text">Get Started with Trike</Link>
                </li>
              </ul>
            </div>
            <div className="col s12 m4 offset-m2 l3">
              <h5 className="grey-text text-lighten-3">Our Services</h5>
              <ul>
                {!userLoading && (
                  isAuthenticated && (
                    <li>
                      <Link to="/bookings" className="white-text">Tracking</Link>
                    </li>
                  )
                )}
                <li>
                  <Link to="/questions/track_guide" className="white-text">Shipping</Link>
                </li>
                <li>
                  <Link to="/questions/operating_hours" className="white-text">Locations</Link>
                </li>
                <li>
                  <Link to="/profile" className="white-text">My Profile</Link>
                </li>
              </ul>
            </div>
            <div className="col s12 m6 l3">
              <h5 className="grey-text text-lighten-3">Information</h5>
              <ul>
                <li>
                  <Link to="/about" className="white-text">About Trike</Link>
                </li>
              </ul>
            </div>
            <div className="col s12 m4 offset-m2 l3">
              <h5 className="grey-text text-lighten-3">Connect with Us</h5>
              <ul>
                <li>
                  <a href="https://www.facebook.com/trike.com.ph" target="_blank" className="white-text">Facebook</a>
                </li>
                <li>
                  <Link to="" className="white-text">Instagram</Link>
                </li>
                <li>
                  <Link to="" className="white-text">Twitter</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright orange darken-2">
          <div className="container center">
            Copyright &copy; 2020
            <Link to="#" className="grey-text text-lighten-3 right">Terms & Conditions</Link>
            <Link to="#" className="grey-text text-lighten-3 left">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    )
  }
}

Footer.propTypes = {
  // logout: PropTypes.func.isRequired,
  // setFilterToggled: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  // filterOpened: state.products.filterOpened,
  // profileOpened: state.layout.profileOpened,
  // siteConfig: state.siteConfig
});

export default connect(mapStateToProps, { })(Footer);