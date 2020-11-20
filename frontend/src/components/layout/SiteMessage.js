import React, { useState } from 'react';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';

const SiteMessage = ({
  siteConfig: { siteInfo },
}) => {

  const [showSiteMessage, setShowSiteMessage] = useState(true)

  return (
    <div className={`site-message card p-1 m-0 ${showSiteMessage && siteInfo ? '' : 'read'}`} role="alert">
      <div className="alert-body center middle">
        <button type="button" className="close" onClick={() => setShowSiteMessage(false)} >&times;</button>
        <p className="center m-0">{siteInfo && siteInfo.site_message}</p>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  siteConfig: state.siteConfig
});

export default connect(mapStateToProps)(SiteMessage)
