import React, { Fragment } from 'react'
import { HashLink as Link } from 'react-router-hash-link';

import ArticleNav from '../ArticleNav'

import { connect } from 'react-redux';

const HoursFAQ = ({}) => {
  
  return (
    <Fragment>
      <ArticleNav/>
      <section className="section section-about">
        <div className="container">
          <div className="row">
            <div className="col s12">
              <h4 className="fw-6">What is Trike's Operating Hours?</h4>
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <p>We typically operate from 6am to 9pm but as long our riders are available, our services are too.</p>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}


export default connect()(HoursFAQ);