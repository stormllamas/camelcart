import React, { Fragment, useEffect } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import ArticleNav from '../ArticleNav'

import { connect } from 'react-redux';


const About = ({}) => {
  const history = useHistory()
  
  return (
    <Fragment>
      <ArticleNav/>
      <section className="section section-about">
        <div className="container">
          <div className="row">
            <div className="col s12">
              <h4 className="fw-6">About Trike</h4>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <h5 className="fw-6">What is Trike?</h5>
              <p>Trike is an online ride hailing, food & parcel delivery platform based in Lucena City.</p>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <h5 className="fw-6">Where does Trike operate?</h5>
              <p>Trike services the whole of Lucena. We typically operate from 6am to 9pm but as long our riders are available, our services are too.</p>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <h5 className="fw-6">What are our goals?</h5>
              <p>Trike is ran in Lucena for Lucenahins. Due to the COVID-19 Pandemic there has been a huge reduction in opportunites for riders. Not only does Trike want to provide jobs, but also let them earn what they deserve. We measure our success by our customer's and our partner's satisfaction.</p>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export default connect()(About);