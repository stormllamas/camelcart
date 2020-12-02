import React, { Fragment, useEffect, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import Topbar from '../layout/Topbar';
import Footer from '../layout/Footer';
import SiteMessage from '../layout/SiteMessage';

const PrivateRoute = ({
  component: Component,
  auth: { userLoading, isAuthenticated },
  siteConfig: { siteInfoLoading, siteInfo },
  location,
  ...rest
}) => {

  const [curLocation, setCurLocation] = useState('')

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
          return <Topbar curLocation={curLocation}/>
        } else {
          if (siteInfo.maintenance_mode) {
            return <Redirect to='/page404' />
          } else {
            if (isAuthenticated) {
              return (
                <Fragment>
                  <SiteMessage/>
                  <Topbar curLocation={curLocation}/>
                  <div className="middle-wrapper">
                    <div className="middle-content">
                      <Component {...props} setCurLocation={setCurLocation} />
                    </div>
                  </div>
                  <Footer/>
                </Fragment>
              )
            } else {
              return <Redirect to='/' />
            }
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