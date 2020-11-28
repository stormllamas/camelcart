import React, { Fragment } from 'react'
import { HashLink as Link } from 'react-router-hash-link';

import ArticleNav from '../ArticleNav'

import { connect } from 'react-redux';


const FoodGuide = ({}) => {
  
  return (
    <Fragment>
      <ArticleNav/>
      <section className="section section-about">
        <div className="container">
          <div className="row">
            <div className="col s12">
              <h4 className="fw-6">How do I order food with trike?</h4>
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
              <h5 className="fw-6">Browse our selection of restaurants</h5>
              <p>At the <Link to="/" className="light-blue-text">homepage</Link> you can find the food section at the beginning of the page</p>
              <p>Upon entering the Trike <Link to="/delivery" className="light-blue-text">food page</Link> you can browse restaurants and filter by cuisine</p>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <h5 className="fw-6">Add items to your cart</h5>
              <p>After selecting a restaurant, you can select food items in their menu and add food options to <Link to="/cart" className="light-blue-text">your cart</Link>.</p>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <h5 className="fw-6">Checkout</h5>
              <p>Go to <Link to="/cart" className="light-blue-text">your cart</Link> and complete the form in the cart before checking out. You'll need to provide your personal detais and select an address as a delivery point.</p>
              <p>After checking out, review your order details, select a payment method and you're done!.</p>
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

export default connect()(FoodGuide);