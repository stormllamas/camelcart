import React, { Fragment } from 'react'
import { HashLink as Link } from 'react-router-hash-link';

import ArticleNav from '../ArticleNav'

import { connect } from 'react-redux';

const RatesFAQ = ({}) => {
  
  return (
    <Fragment>
      <ArticleNav/>
      <section className="section section-about">
        <div className="container">
          <div className="row">
            <div className="col s12">
              <h4 className="fw-6">What are our rates?</h4>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <p>We typically charge P70 to P105 for deliveries within Lucena. Our calculations are automated and are based on a rate of P35/1km.</p>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}


export default connect()(RatesFAQ);