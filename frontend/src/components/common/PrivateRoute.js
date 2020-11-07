import React, { useEffect, Fragment } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux'

import Topbar from '../layout/Topbar';
import Footer from '../layout/Footer';

const PrivateRoute = ({
  component: Component,
  auth: { userLoading, isAuthenticated },
  siteConfig: { siteInfoLoading, siteInfo },
  location,
  ...rest
}) => {

  useEffect(() => {
    if (!userLoading && !siteInfoLoading) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
    } else {
      $('.loader').show();
      $('.middle-content').hide();
    }
  }, [userLoading, siteInfoLoading])
  
  return (
    <Route
      {...rest}
      render={ props => {
        if (userLoading || siteInfoLoading) {
          return <Topbar/>
        } else {
          if (siteInfo.maintenance_mode) {
            return <Redirect to='/site?0' />
          } else {
            return (
              <Fragment>
                <Topbar/>
                <div className="middle-wrapper">
                  <div className="middle-content">
                    <Component {...props} />
                  </div>
                </div>
                {isAuthenticated && <Footer/>}
              </Fragment>
            )
          }
        }
      }}
    />
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
  logistics: state.logistics
});

export default connect(mapStateToProps)(PrivateRoute);