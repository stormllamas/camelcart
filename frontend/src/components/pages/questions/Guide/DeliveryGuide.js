import React, { Fragment } from 'react'
import { HashLink as Link } from 'react-router-hash-link';

import ArticleNav from '../ArticleNav'

import { connect } from 'react-redux';


const DeliveryGuide = ({}) => {
  
  return (
    <Fragment>
      <ArticleNav/>
      <section className="section section-about">
        <div className="container">
          <div className="row">
            <div className="col s12">
              <h4 className="fw-6">How do I book a delivery?</h4>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <h5 className="fw-6">Signup with Trike</h5>
              <p>To start off, you'll need an account with Trike. You can <Link to="/signup" className="light-blue-text">signup here</Link> or if you already have an account, you can <Link to="/login" className="light-blue-text">login here</Link></p>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <h5 className="fw-6">Fill up our delivery form</h5>
              <p>At the <Link to="/" className="light-blue-text">homepage</Link> you can find the delivery section at the beginning of the page</p>
              <p>Upon entering the Trike <Link to="/delivery" className="light-blue-text">delivery page</Link>, simply fill out the form. These inlcude your <b>personal information</b> (automatically filled up based on your profile), <b>Pickup and delivery</b> and <b>shipment details</b> if necessary and checkout</p>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <h5 className="fw-6">Checkout</h5>
              <p>Go to checkout and select a your payment method and you're done!</p>
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

export default connect()(DeliveryGuide);