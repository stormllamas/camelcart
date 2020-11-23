import React, { Fragment, useEffect, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import AdminTopbar from '../manager/AdminTopbar';

const SellerRoute = ({
  component: Component,
  auth: { userLoading, isAuthenticated, user },
  siteConfig: { siteInfoLoading },
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
          return <AdminTopbar curLocation={curLocation}/>
        } else {
          if (user) {
            return user.is_staff || user.groups.includes('seller') && isAuthenticated ? (
              <Fragment>
                <AdminTopbar curLocation={curLocation}/>
                <div className="middle-wrapper">
                  <div className="middle-content">
                    <Component {...props} setCurLocation={setCurLocation} />
                  </div>
                </div>
              </Fragment>
            ) : (
              <Redirect to='/' />
            )
          } else {
            return <Redirect to='/' />
          }
        }
      }}
    />
  )
}

SellerRoute.propTypes = {
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
  logistics: state.logistics
});

export default connect(mapStateToProps)(SellerRoute);