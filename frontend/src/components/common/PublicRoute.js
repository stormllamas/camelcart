import React, { Fragment, useEffect, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import Topbar from '../layout/Topbar';
import Footer from '../layout/Footer';

const PublicRoute = ({
  component: Component,
  auth: { userLoading, },
  siteConfig: { siteInfoLoading, siteInfo },
  ...rest
}) => {

  const [curLocation, setCurLocation] = useState('')

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
          return <Topbar curLocation={curLocation}/>
        } else {
          if (siteInfo.maintenance_mode) {
            return <Redirect to='/page404' />
          } else {
            return (
              <Fragment>
                <Topbar curLocation={curLocation}/>
                <div className="middle-wrapper">
                  <div className="middle-content">
                    <Component {...props} setCurLocation={setCurLocation} />
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