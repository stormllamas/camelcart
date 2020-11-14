import React, { Fragment, useEffect } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import Topbar from '../layout/Topbar';


const Home = ({
  auth: {isAuthenticated, userLoading },
  // siteConfig: { maintenanceMode, betaMode },
  // profileOpened, logout, setMobileMenu, setFilterToggled
  location
}) => {
  const history = useHistory()

  useEffect(() => {
    $('.slider').slider({
      indicators: true,
      height: 450,
      transition: 500,
      interval: 6000
    });
  }, [])
  
  // useEffect(() => {
  //   if (!userLoading) {
  //     $('.loader').fadeOut();
  //     $('#middle-content').fadeIn();
  //   }
  // }, [userLoading])
  
  return (
    <Fragment>
      <section className="section section-icons center">
        <div className="container">
          <div className="row mb-2">
            <div className="col s12">
              <h5>Our Service</h5>
            </div>
          </div>
          <div className="row mt-1 mb-1">
            <div className="col s4">
              <Link to="/food" className="card-panel left-align">
                <div className="center">
                  <img src="static/frontend/img/Trike_food_logo.png" className="scale-pop" alt=""/>
                </div>
                <h5>Food</h5>
                <p className="hide-on-med-and-down">Order your favorite local food and have it delivered to you</p>
              </Link>
            </div>
            <div className="col s4">
              <div className="card-panel left-align disabled">
                <div className="primary-overlay above"></div>
                <div className="center">
                  <img src="static/frontend/img/Trike_grocery_logo.png" className="scale-pop" alt=""/>
                </div>
                <h5>Grocery</h5>
                <p className="hide-on-med-and-down">One of our riders will shop for you and deliver your grocery needs to your home</p>
              </div>
            </div>
            <div className="col s4">
              <Link to="/delivery" className="card-panel left-align">
                <div className="center">
                  <img src="static/frontend/img/Trike_motor_logo.png" className="scale-pop" alt=""/>
                </div>
                <h5>Delivery</h5>
                <p className="hide-on-med-and-down">Schedule an item for pickup and delivery by our trusted riders</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <header className="slider header-slider">
        <ul className="slides">
          <li>
            <img src="static/frontend/img/motorcycles.jpg" alt=""/>
            <div className="primary-overlay"></div>
            <div className="caption center-align">
              <h2>How we Help Local Businesses</h2>
              <h5 className="light grey-text text-lighten-3 hide-on-small-only mb-5">A slurry of riders are ready to serve Lucena City for convenient and fast deliveries</h5>
              <a href="#" className="btn btn-large green">Learn More</a>
            </div>
          </li>
          <li>
            <img src="static/frontend/img/personal-shopper.jpg" alt=""/>
            <div className="primary-overlay"></div>
            <div className="caption left-align">
              <h2>Have a Personal Shopper</h2>
              <h5 className="light grey-text text-lighten-3 hide-on-small-only mb-5">Select your prefered grocery shop or even your favorite personal shopper to get your daily grocery needs.</h5>
              <a href="#" className="btn btn-large green">Learn More</a>
            </div>
          </li>
          <li>
            <img src="static/frontend/img/delivery-packages.jpg" alt=""/>
            <div className="primary-overlay"></div>
            <div className="caption right-align">
              <h2>Delivery</h2>
              <h5 className="light grey-text text-lighten-3 hide-on-small-only mb-5">Learn how we handle your packages and what options you have with us</h5>
              <a href="#" className="btn btn-large green">Learn More</a>
            </div>
          </li>
        </ul>
      </header>

      <section className="section section-cards ">
        <div className="container">
          <div className="row">
            <div className="col s12 m4">
              <div className="card">
                <div className="card-content">
                  <Link to="#" className="card-title">Ask us a Question</Link>
                  <p>Want to ask our team a question? Send us a message here</p>
                </div>
                <Link to="#" className="card-image">
                  <img src="static/frontend/img/personal-shopper.jpg" className="responsive-img"/>
                </Link>
              </div>
            </div>
            <div className="col s12 m4">
              <div className="card">
                <div className="card-content">
                  <Link to="#" className="card-title">Haven’t Shipped with Us?</Link>
                  <p>Learn more about how to send with Camel Cart</p>
                </div>
                <Link to="#" className="card-image">
                  <img src="static/frontend/img/parcel-delivery.jpg" className="responsive-img"/>
                </Link>
              </div>
            </div>
            <div className="col s12 m4">
              <div className="card">
                <div className="card-content">
                  <Link to="#" className="card-title">FAQ</Link>
                  <p>Have questions you want asked? Check them first at our FAQ Page</p>
                </div>
                <Link to="#" className="card-image">
                  <img src="static/frontend/img/motorcycles.jpg" className="responsive-img"/>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

Home.propTypes = {
  // logout: PropTypes.func.isRequired,
  // setFilterToggled: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  // filterOpened: state.products.filterOpened,
  // profileOpened: state.layout.profileOpened,
  // siteConfig: state.siteConfig
});

export default connect(mapStateToProps, { })(Home);