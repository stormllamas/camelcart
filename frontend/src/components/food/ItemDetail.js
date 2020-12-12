import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import FoodCart from './FoodCart'

import { getSeller, getProduct, addOrderItem } from '../../actions/logistics'


const ItemDetail = ({
  logistics: {
    currentOrderLoading,
    currentOrder,

    productLoading,
    product
  },
  auth: {
    isAuthenticated, user
  },
  getProduct,
  addOrderItem
}) => {
  const history = useHistory()
  const query = new URLSearchParams(history.location.search);

  const [selectedVariant, setSelectedVariant] = useState('')

  const addToOrder = (e) => {
    e.preventDefault();
    if (selectedVariant !== '') {
      addOrderItem({
        productId: selectedVariant,
        sellerID: product.seller.id
      })
    } else {
      M.toast({
        html: 'Please select a product',
        displayLength: 3500,
        classes: 'red'
      });
    }
  }
  
  useEffect(() => {
    const itemQuery = query.get('item')
    getProduct({
      productQuery: itemQuery
    })
  }, []);

  useEffect(() => {
    if (!productLoading) {
      const itemQuery = query.get('item')
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
      $('.carousel.carousel-slider').carousel({
        fullWidth: true,
        swipeable: true,
        indicators: true,
      });
      $('.materialboxed').materialbox();
      $('.modal').modal({
        dismissible: true,
        inDuration: 300,
        outDuration: 200,
      });
      product.variants.length > 0 && (
        setSelectedVariant(product.variants[0].id)
      )
      if (itemQuery === product.name.replace(' ', '-')) {
        !product.is_published && history.push('/food')
      }
    } else {
      $('.loader').show();
    }
  }, [productLoading]);
  
  return (
    <section className="section section-product pb-1">
      <div className="container">
        {!currentOrderLoading && currentOrder !== null && (
          currentOrder.order_items.length > 0 && (
            <div className="fixed-action-btn">
              <a className="btn-floating btn-large green modal-trigger waves-effect" data-target="cartmodal">
                <i className="large material-icons">shopping_cart</i>
              </a>
            </div>
          )
        )}
        {!productLoading && (
          product !== null ? (
            <Fragment>
              <div className="row">
                <div className="col s12 m12 l7">
                  <div className="row">
                    <div className="col s12">
                      <img className="responsive-img" src={product.thumbnail}/>
                    </div>
                  </div>
                  <div className="row">
                    {product.photo_1 && (
                      <div className="materialboxed col s3">
                        <img className="responsive-img" src={product.photo_1}/>
                      </div>
                    )}
                    {product.photo_2 && (
                      <div className="materialboxed col s3">
                        <img className="responsive-img" src={product.photo_2}/>
                      </div>
                    )}
                    {product.photo_3 && (
                      <div className="materialboxed col s3">
                        <img className="responsive-img" src={product.photo_3}/>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col s12 m12 l5">
                  <div className="pt-2">
                    <h5>{product.name}</h5>
                    {isAuthenticated ? (
                      product.variants.length > 0 && !currentOrderLoading && (
                        <form>
                          {product.variants.map((variant, index) => (
                            <Fragment>
                              <p key={variant.id} className="flex-row separate">
                                <label>
                                  <input className="with-gap green-text" name="group1" type="radio" value={variant.id} onChange={e => setSelectedVariant(e.target.value)} required/>
                                  <span className="grey-text text-darken-2">{variant.name}</span>
                                </label>
                                {variant.sale_price_active ? (
                                  <span className="grey-text text-darken-2 right no-white-space ml-2"><span className="grey-text">₱ { variant.price }</span><span className="grey-text">-{ variant.percent_off }%</span><span className="ml-1 fs-18">₱ {variant.final_price.toFixed(2)}</span></span>
                                ) : (
                                  <span className="grey-text text-darken-2 right no-white-space">₱ {variant.final_price}</span>
                                )}
                              </p>
                              <div className="divider"></div>
                            </Fragment>
                          ))}
                          {!user.groups.includes('rider') && (
                            <button className="btn btn-full btn-large green mt-5" onClick={e => addToOrder(e)}>
                              Add To Order
                            </button>
                          )}
                        </form>
                      )
                    ) : (
                      <Link to="/login" className="btn btn-large green mt-5">Log in to Order</Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="divider"></div>
              </div>
              <div className="row">
                <div className="col s12">
                  <h5>Description</h5>
                  <p>{product.description}</p>
                </div>
              </div>
              <div id="cartmodal" className="modal bottom-sheet full-height">
                <a className="modal-action modal-close cancel"><i className="material-icons grey-text">close</i></a>
                <FoodCart seller={product.seller}/>
              </div>
            </Fragment>
          ) : (
            <div className="row">
              <div className="col s12 m6 l7 grey">
                <div className="carousel"></div>
              </div>
              <div className="col s12 m6 l5">
                <div className="p-5">
                  <h5>Product Not Found</h5>
                </div>
                <div className="col s12">
                  <Link to="/food" className="flex-row middle blue-text"><i className="material-icons">chevron_left</i>
                    <p>Go Back</p>
                  </Link>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  )
}

ItemDetail.propTypes = {
  getProduct: PropTypes.func.isRequired,
  addOrderItem: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getSeller, getProduct, addOrderItem })(ItemDetail);