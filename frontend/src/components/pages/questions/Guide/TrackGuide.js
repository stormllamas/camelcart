import React, { Fragment } from 'react'
import { HashLink as Link } from 'react-router-hash-link';

import ArticleNav from '../ArticleNav'

import { connect } from 'react-redux';


const RideGuide = ({}) => {
  
  return (
    <Fragment>
      <ArticleNav/>
      <section className="section section-about">
        <div className="container">
          <div className="row">
            <div className="col s12">
              <h4 className="fw-6">How to track my bookings?</h4>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <h5 className="fw-6">Check Bookings</h5>
              <p>Check your booking at the <Link to="/bookings" className="light-blue-text">My Bookings</Link> page. track your bookings by clicking on the button at the top right of each order.</p>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}


export default connect()(RideGuide);