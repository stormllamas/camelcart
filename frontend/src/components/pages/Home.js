import React, { Fragment, useEffect } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import Topbar from '../layout/Topbar';


const Home = ({setCurLocation}) => {
  const history = useHistory()

  useEffect(() => {
    $('.header-slider .slider').slider({
      indicators: true,
      height: 450,
      transition: 500,
      interval: 6000
    });
    $('.section-instructions .slider').slider({
      indicators: true,
      height: 350,
      transition: 500,
      interval: 6000
    });
    $('.scrollspy').scrollSpy({
      scrollOffset: '100'
    });
  }, [])

  
  useEffect(() => {
    setCurLocation(history.location)
  }, [history]);
  
  return (
    <Fragment>
      <section id="section-icons" className="section section-icons center scrollspy">
        <div className="container">
          <div className="row mb-2">
            <div className="col s12">
              <h5 className="fw-6">Our Services</h5>
            </div>
          </div>
          <div className="row mt-1 mb-1">
            <div className="col s4">
              <div className="card-panel left-align disabled">
                <div className="primary-overlay above center"></div>
                <div className="center">
                  <img src="static/frontend/img/Trike_food_logo.png" className="scale-pop" alt=""/>
                </div>
                <h5>Food</h5>
                <p className="hide-on-med-and-down">Order your favorite local food and have it delivered to you</p>
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
            <div className="col s4">
              <div className="card-panel left-align disabled">
                <div className="primary-overlay above center"></div>
                <div className="center">
                  <img src="static/frontend/img/Trike_hail_logo.png" className="scale-pop" alt=""/>
                </div>
                <h5>Ride Hailing</h5>
                <p className="hide-on-med-and-down">Get a ride from one our our riders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <header className="header-slider">
        <div className="slider">
          <ul className="slides">
            <li>
              <img src="static/frontend/img/trike_content_slider_instruction.jpg" alt=""/>
              <div className="primary-overlay"></div>
              <div className="caption right-align">
                <h2>New to Trike?</h2>
                <h5 className="light grey-text text-lighten-3 hide-on-small-only mb-5">Checkout our easy guide on how to book with Trike?</h5>
                <a href="#instructions" className="btn btn-large green">Go to Guide</a>
              </div>
            </li>
            <li>
              <img src="static/frontend/img/Buddys.jpg" alt=""/>
              <div className="primary-overlay"></div>
              <div className="caption center-align">
                <h2>How we Help Local Businesses</h2>
                <h5 className="light grey-text text-lighten-3 hide-on-small-only mb-5">A slurry of riders are ready to serve Lucena City for convenient and fast deliveries</h5>
                <a href="#" className="btn btn-large green">Learn More</a>
              </div>
            </li>
            {/* <li>
              <img src="static/frontend/img/personal-shopper.jpg" alt=""/>
              <div className="primary-overlay"></div>
              <div className="caption left-align">
                <h2>Have a Personal Shopper</h2>
                <h5 className="light grey-text text-lighten-3 hide-on-small-only mb-5">Select your prefered grocery shop or even your favorite personal shopper to get your daily grocery needs.</h5>
                <a href="#" className="btn btn-large green">Learn More</a>
              </div>
            </li> */}
            <li>
              <img src="static/frontend/img/motorcycles.jpg" alt=""/>
              <div className="primary-overlay"></div>
              <div className="caption left-align">
                <h2>Become a Rider Now</h2>
                <h5 className="light grey-text text-lighten-3 hide-on-small-only mb-5">Be part of our growing squad of riders and earn more than you ever could have</h5>
                <a href="#" className="btn btn-large green">Learn More</a>
              </div>
            </li>
          </ul>
        </div>
      </header>

      <section className="section section-cards">
        <div className="container">
          <div className="row">
            <div className="col s12 m4">
              <div className="card">
                <div className="card-content">
                  <Link to="/contact" className="card-title">Ask us a Question</Link>
                  <p>Want to ask our team a question? Send us a message <Link to="/contact" className="blue-text">here</Link></p>
                </div>
                <Link to="/contact" className="card-image">
                  <img src="static/frontend/img/personal-shopper.jpg" className="responsive-img"/>
                </Link>
              </div>
            </div>
            <div className="col s12 m4">
              <div className="card">
                <div className="card-content">
                  <Link to="/questions/food" className="card-title">Haven’t Shipped with Us?</Link>
                  <p>Learn more about how to send with Trike</p>
                </div>
                <Link to="/questions/food" className="card-image">
                  <img src="static/frontend/img/parcel-delivery.jpg" className="responsive-img"/>
                </Link>
              </div>
            </div>
            <div className="col s12 m4">
              <div className="card">
                <div className="card-content">
                  <Link to="/about" className="card-title">FAQ</Link>
                  <p>Have questions you want asked? Check them first at our FAQ Page</p>
                </div>
                <Link to="/about" className="card-image">
                  <img src="static/frontend/img/motorcycles.jpg" className="responsive-img"/>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-about-trike white-text relative mb-5">
        <div className="primary-overlay branded valign-wrapper">
          <div className="container">
            <div className="row flex middle">
              <div className="col s12 m8">
                <h4>What is Trike all about?</h4>
                <p>Trike is an online courier, ride hailing, and food delivery platform based in Lucena City designed for convenient user booking.</p>
              </div>
              <div className="col s12 m4 flex-col center middle">
                <a href="#section-icons" className="btn orange btn-large uppercase no-white-space">
                  <i className="fas fa-motorcycle mr-1 fs-18"></i>Book Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="instructions" className="section-instructions scrollspy">
        <div className="container center">
          <div className="row mb-2">
            <div className="col s12">
              <h5 className="fw-6">How to Book with Trike?</h5>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <div className="slider">
                <ul className="slides">
                  <li>
                    <img src="static/frontend/img/trike_content_signup_instruction.jpg" alt=""/>
                    <div className="caption center-align">
                      <h5 className="uppercase">Step 1: Create an account</h5>
                    </div>
                  </li>
                  <li>
                    <img src="static/frontend/img/trike_content_service_instruction.jpg" alt=""/>
                    <div className="caption center-align">
                      <h5 className="uppercase">Step 2: Choose a service</h5>
                    </div>
                  </li>
                  <li>
                    <img src="static/frontend/img/trike_content_details_instruction.jpg" alt=""/>
                    <div className="caption center-align">
                      <h5 className="uppercase">Step 3: Finalize Details</h5>
                    </div>
                  </li>
                  <li>
                    <img src="static/frontend/img/trike_content_payments_instruction.jpg" alt=""/>
                    <div className="caption center-align">
                      <h5 className="uppercase">Step 4: Finalize Transaction</h5>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

Home.propTypes = {
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { })(Home);