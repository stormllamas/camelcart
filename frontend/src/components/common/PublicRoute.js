import React, { useEffect, Fragment } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Topbar from '../layout/Topbar';
import Footer from '../layout/Footer';

const PublicRoute = ({
  component: Component,
  auth: { userLoading, },
  siteConfig: { siteInfoLoading, siteInfo },
  ...rest
}) => {

  useEffect(() => {
    if (!userLoading && !siteInfoLoading ) {
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
                <Footer/>
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
});

export default connect(mapStateToProps)(PublicRoute);