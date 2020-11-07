import React, { useEffect, Fragment } from 'react'
import { Route, Redirect, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import Topbar from '../layout/Topbar';

const AccountsRoute = ({
  component: Component,
  auth: { userLoading, isAuthenticated },
  siteConfig: { siteInfoLoading, siteInfo },
  ...rest
}) => {
  const history = useHistory()
  
  useEffect(() => {
    if (!userLoading) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
    } else {
      $('.loader').fadeIn();
    }
  }, [userLoading])
  
  return (
    <Route
      {...rest}
      render={ props => {
        if (userLoading || siteInfoLoading) {
          return <Topbar/>
        } else {
          if (siteInfo.maintenance_mode) {
            return <Redirect to='/site?0' />
          } else if (isAuthenticated) {
            return <Redirect to="/"/>
          } else {
            return (
              <Fragment>
                <Topbar/>
                <div className="middle-wrapper">
                  <div className="middle-content">
                    <Component {...props} />
                  </div>
                </div>
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

export default connect(mapStateToProps)(AccountsRoute);