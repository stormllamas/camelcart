import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import Preloader from '../common/Preloader'
import FoodCart from './FoodCart'
import RestaurantDetailItem from './RestaurantDetailItem'

import { getSeller, getProducts, setCourse } from '../../actions/logistics'


const RestaurantDetail = ({
  logistics: { 
    currentOrderLoading,
    currentOrder,

    sellerLoading,
    seller,

    courseFilter,

    productsLoading, moreProductsLoading,
    products
  },
  getSeller,
  getProducts,
  setCourse
}) => {
  const history = useHistory()
  const querySearch = new URLSearchParams(history.location.search);

  const setQuery = (query, filter, set) => {
    const sellerQuery = querySearch.get('b')
    query.split('--').forEach(q => {
      filter !== q && set({
        course: q,
        history,
        sellerQuery
      })
    })
  }
  
  useEffect(() => {
    const sellerQuery = querySearch.get('b')
    getSeller({
      sellerQuery
    })
  }, []);

  useEffect(() => {
    const sellerQuery = querySearch.get('b')
    if (!sellerLoading) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
      $('.modal').modal({
        dismissible: true,
        inDuration: 300,
        outDuration: 200,
      });
      const courseQuery = querySearch.get('course')
      if (courseQuery) {
        setQuery(courseQuery, courseFilter, setCourse)
      } else {
        setCourse({
          course: 'Meals',
          history,
          sellerQuery
        })
      }
    } else {
      $('.loader').show();
      $('.middle-content').hide();
    }
  }, [sellerLoading]);
  
  useEffect(() => {
    const sellerQuery = querySearch.get('b')
    if (!sellerLoading && courseFilter && seller !== null) {
      if (products.results.length < 1) {
        getProducts({
          getMore: false
        })
      } else {
        if (sellerQuery === seller.name_to_url) {
          getProducts({
            getMore: false
          })
        }
      }
    }
  }, [sellerLoading, courseFilter, seller]);

  useEffect(() => {
    if (!productsLoading) {
      $('.tabs').tabs();
    }
  }, [productsLoading]);
  
  return (
    !sellerLoading && (
      seller !== null ? (
        <Fragment>
          <div className="container">
            <div className="row m-0 mt-2">
              <div className="col s12 mt-3">
                <Link to="/food" className="grey-text text-darken-1">
                  <span className="m-0 fs-18"><i className="fas fa-arrow-left fs-17 mr-1"></i>Go Back</span>
                </Link>
              </div>
            </div>
          </div>
          <section className="section section-restaurant-header pb-1">
            <div className="container">
              {!currentOrderLoading && currentOrder && (
                currentOrder.order_items.length > 0 && (
                  <div className="fixed-action-btn">
                    <a className="btn-floating btn-large green modal-trigger waves-effect" data-target="cartmodal">
                      <i className="large material-icons">shopping_cart</i>
                    </a>
                  </div>
                )
              )}
              <div className="row mb-0">
                <div className="col s12">
                  <h4 className="mb-1">{seller.name}</h4>
                </div>
                {seller.categories.length > 0 && (
                  <div className="col s12">
                    <ul className="mt-0">
                      {seller.categories.map((category) => (
                        <span key={category.id} className="grey-text mr-2">{category.name}</span>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="col s12">
                  {seller.review_count > 0 ? [...Array(seller.total_rating).keys()].map(star => <i key={star} className="material-icons orange-text">star</i>) : <div className="mb-2"><span className="bdg bdg-mute bdg-small m-0 mb-2 grey lighten-2 fs-16 rad-1 p-1">Unrated</span></div>}
                  {seller.review_count > 0 && [...Array(Math.max(5-seller.total_rating, 0)).keys()].map(star => <i key={star} className="material-icons grey-text text-lighten-2">star</i>)}
                  {seller.review_count > 0 && <p className="grey-text mt-0">{seller.total_rating_unrounded.toFixed(2)} ({seller.review_count} ratings)</p>}
                </div>
                <div className="col s12">
                  <div className="divider"></div>
                </div>
              </div>
            </div>
          </section>
          <section className="section section-restaurant-features list-slider pt-0">
            <div className="container">
              <div className="row mb-0">
                <div className="col s12">
                  <h5>Featured Items</h5>
                </div>
              </div>
              <div className="row mb-0">
                <div className="col s12 flex-row wrapper">
                  {seller.features.map(feature => (
                    <div key={feature.id} className="p-1">
                      <Link to={`restaurant/product?item=${feature.name_to_url}&b=${feature.seller.name_to_url}`} className="slider-img bg-cover rad-2 grey lighten-3" style={{ backgroundImage: `url(${feature.thumbnail})`}}/>
                      <p className="mt-1 mb-0">{feature.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="section section-restaurant-products">
            <div className="container">
              <div className="row">
                <div className="col s12">
                  <ul className="tabs">
                    <li className="tab col s3">
                      <a className={`grey-text text-darken-2 waves-effect waves-grey p-0 ${courseFilter === 'Meals' ? 'active' : ''}`} onClick={() => setCourse({ course: 'Meals', history})}>Meals</a>
                    </li>
                    <li className="tab col s3">
                      <a className={`grey-text text-darken-2 waves-effect waves-grey p-0 ${courseFilter === 'Soup' ? 'active' : ''}`} onClick={() => setCourse({ course: 'Soup', history})}>Soup</a>
                    </li>
                    <li className="tab col s3">
                      <a className={`grey-text text-darken-2 waves-effect waves-grey p-0 ${courseFilter === 'Sides' ? 'active' : ''}`} onClick={() => setCourse({ course: 'Sides', history})}>Sides</a>
                    </li>
                    <li className="tab col s3">
                      <a className={`grey-text text-darken-2 waves-effect waves-grey p-0 ${courseFilter === 'Dessert' ? 'active' : ''}`} onClick={() => setCourse({ course: 'Dessert', history})}>Dessert</a>
                    </li>
                  </ul>
                </div>
                <div className="col s12 active-tab">
                  <div className="row pt-2">
                  {!productsLoading && (
                    products.results.length > 0 ? (
                      products.results.map((product, index) => (
                        <RestaurantDetailItem key={product.id} product={product} products={products} index={index} productsLoading={productsLoading} />
                      ))
                    ) : (
                      <div className="col s12 flex-col center mt-5">
                        <img src="/static/frontend/img/Trike_no_products.svg" alt="No Products" style={{ height:"150px" }}/>
                        <h4 className="uppercase fw-6 orange-text fs-22">No Products Found</h4>
                      </div>
                    )
                  )}
                  {moreProductsLoading || productsLoading ? (
                    <div className="flex-col center middle relative preloader-wrapper">
                      <Preloader color="green" size="small" adds=""/>
                    </div>
                  ) : undefined}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div id="cartmodal" className="modal bottom-sheet full-height">
            <a className="modal-action modal-close cancel"><i className="material-icons grey-text">close</i></a>
            <FoodCart seller={seller}/>
          </div>
        </Fragment>
      ) : (
        <section className="section section-restaurant-header pb-1">
          <div className="container">
            <div className="row mb-0">
              <div className="col s12">
                <h4 className="mb-1">Not Found</h4>
              </div>
              <div className="col s12">
                <Link to="/food" className="flex-row middle blue-text"><i className="material-icons">chevron_left</i>
                  <p>Go Back</p>
                </Link>
              </div>
              <div className="col s12">
                <div className="divider"></div>
              </div>
            </div>
          </div>
        </section>
      )
    )
  )
}

RestaurantDetail.propTypes = {
  getSeller: PropTypes.func.isRequired,
  getProducts: PropTypes.func.isRequired,
  setCourse: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getSeller, getProducts, setCourse })(RestaurantDetail);