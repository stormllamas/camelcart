import React, { Fragment, useEffect } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';


const ArticleNav = ({}) => {
  const history = useHistory()

  useEffect(() => {
    $('.modal').modal({
      dismissible: true,
      inDuration: 300,
      outDuration: 200,
    });

    $('.collapsible').collapsible({
      accordion: false
    });
  }, [])
  
  return (
    <Fragment>
      <div className="fixed-action-btn top-right">
        <a data-target="article-navigation" className="btn-floating light-blue modal-trigger waves-effect">
          <i className="large material-icons">keyboard_arrow_down</i>
        </a>
      </div>
      <div id="article-navigation" className="modal modal-fixed-footer">
        <div className="modal-content p-0">
          <ul className="collapsible m-0 no-shadow">
            <li className="active">
              <div className="collapsible-header">
                Welcome to Trike: A Guide to New Trikers<i className="material-icons">keyboard_arrow_down</i>
              </div>
              <div className="collapsible-body pt-1 pb-1">
                <p><Link to="/questions/food" className="modal-close sidenav-close grey-text text-darken-1">How do I order food with Trike?</Link></p>
                <p><Link to="/questions/delivery_guide" className="modal-close sidenav-close grey-text text-darken-1">How do I book a delivery?</Link></p>
                <p><Link to="/questions/ride_guide" className="modal-close sidenav-close grey-text text-darken-1">How do I book a ride?</Link></p>
                <p><Link to="/questions/track_guide" className="modal-close sidenav-close grey-text text-darken-1">How do I track my bookings/orders?</Link></p>
              </div>
            </li>
          </ul>
          <ul className="collapsible m-0 no-shadow">
            <li className="active">
              <div className="collapsible-header">
                Shipping and Delivery FAQ<i className="material-icons">keyboard_arrow_down</i>
              </div>
              <div className="collapsible-body pt-1 pb-1">
                <p><Link to="/questions/rates" className="modal-close sidenav-close grey-text text-darken-1">What are our rates?</Link></p>
                <p><Link to="/questions/operating_hours" className="modal-close sidenav-close grey-text text-darken-1">What is Trike's operating hours?</Link></p>
              </div>
            </li>
          </ul>
          <ul className="collapsible m-0 no-shadow">
            <li className="active">
              <div className="collapsible-header">
                About Us<i className="material-icons">keyboard_arrow_down</i>
              </div>
              <div className="collapsible-body pt-1 pb-1">
                <p><Link to="/about" className="modal-close sidenav-close grey-text text-darken-1">About Trike</Link></p>
                <p><Link to="/terms_and_conditions" className="modal-close sidenav-close grey-text text-darken-1">Terms & Conditions</Link></p>
                <p><Link to="/privacy_policy" className="modal-close sidenav-close grey-text text-darken-1">Privacy Policy</Link></p>
                <p><Link to="/about" className="modal-close sidenav-close grey-text text-darken-1">Our partners</Link></p>
              </div>
            </li>
          </ul>
          <ul className="collapsible m-0 no-shadow">
            <li className="active">
              <div className="collapsible-header">
                Other Information<i className="material-icons">keyboard_arrow_down</i>
              </div>
              <div className="collapsible-body pt-1 pb-1">
                <p><Link to="/about" className="sidenav-close grey-text text-darken-1">How do I make an account with Trike?</Link></p>
              </div>
            </li>
          </ul>
        </div>
        <div className="modal-footer">
          <a className="modal-action modal-close"><i className="material-icons grey-text mt-2 mr-2">close</i></a>
        </div>
      </div>
    </Fragment>
  )
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { })(ArticleNav);