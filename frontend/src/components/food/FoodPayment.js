import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import AuthPrompt from '../layout/AuthPrompt'

import { finalizeTransaction, getCurrentOrder, proceedWithCOD } from '../../actions/logistics'

const FoodPayment = ({
  auth: { userLoading, isAuthenticated },
  logistics: { currentOrder, currentOrderLoading, completeOrderLoading },
  getCurrentOrder,
  finalizeTransaction,
  proceedWithCOD,
  match
}) => {
  const history = useHistory()


  const getDateNow = () => {
    let today = new Date();
    let dd = today.getDate();
    
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    if(dd<10) {
      dd='0'+dd;
    } 
    
    if(mm<10) {
      mm='0'+mm;
    } 
    const now = mm+'-'+dd+'-'+yyyy;
    return now
  }

  const renderPaypalButtons = () => {
    paypal.Buttons({
      // enableStandardCardFields: true,
      style: {
        color: "gold",
        shape: "rect",
        label: "pay",
        height: 40,
        size: 'responsive'
      },

      // Set up the transaction
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              invoice_id: currentOrder.ref_code,
              description: "Trike food order on "+ getDateNow(),
              amount: {
                currency_code: "PHP",
                value: currentOrder.total,
              },
              breakdown: {
                shipping: {
                  currency_code: "PHP",
                  value: currentOrder.shipping,
                },
              },
              payee: {
                email: 'support@trike.com.ph',
                account_id: '72BMFG9YMYA2A'
              },
              shipping: {
                // method: "United States Postal Service",
                name: {
                  full_name: currentOrder.first_name+' '+ currentOrder.last_name
                },
                shipping_type : 'standard',
              }
            },
          ],
        });
      },
    
      // Finalize the transaction
      onApprove: function (data, actions) {
        // Authorize the transaction
        actions.order.authorize().then(function(authorization) {
          const authorizationID = authorization.purchase_units[0].payments.authorizations[0].id
          finalizeTransaction({
            authID: authorizationID,
            currentOrder: currentOrder,
            history: history,
            type: 'food',
            query: `?order_seller=${currentOrder.seller.id}`
          })
        });
      },
    }).render("#paypal-button-container");
  }

  const checkCurrentOrder = CO => {
    if (CO.first_name !== null && CO.last_name !== null && CO.contact !== null && CO.email !== null && CO.gender !== null && CO.loc1_latitude !== null && CO.loc1_longitude !== null && CO.loc1_address !== null && CO.loc2_latitude !== null && CO.loc2_longitude !== null && CO.loc2_address !== null) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    getCurrentOrder({
      type: 'food',
      query: `?order_seller_name=${match.params.seller}&for_checkout=true`
    })
  }, [])

  useEffect(() => {
    if(!currentOrderLoading) {
      if (currentOrder) {
        if (checkCurrentOrder(currentOrder)) {
          M.updateTextFields();
      
          $('.collapsible').collapsible({
            accordion: false
          });
          // renderPaypalButtons()
        } else {
          M.toast({
            html: 'Checkout session expired',
            displayLength: 3500,
            classes: 'red',
          });
        }
        if (!currentOrder.has_valid_item) {
          history.push(`/food/restaurant?b=${match.params.seller}&course=Meals`)
        }
      }
    }
  }, [currentOrderLoading])
  
  useEffect(() => {
    if (!completeOrderLoading) {
      $('.loader').fadeOut();
    } else {
      $('.loader').fadeIn();
    }
  }, [completeOrderLoading]);

  return (
    isAuthenticated ? (
      !currentOrderLoading && (
        currentOrder ? (
          (checkCurrentOrder(currentOrder)) ? (
            <section className="section section-delivery-payments">
              <div className="container">
                <div className="card">
                  <div className="card-content">
                    <div className="card-title mb-1">Payment Summary</div><p className="mb-2">(Please review the details below)</p>
                    <div className="row">
                      <div className="col s12 mb-1">
                        <small>Pickup Address</small>
                        <p className="grey lighten-3 p-1 rad-2">{currentOrder.loc1_address}</p>
                      </div>
                      <div className="col s12 mb-1">
                        <small>Delivery Address</small>
                        <p className="grey lighten-3 p-1 rad-2">{currentOrder.loc2_address}</p>
                      </div>
                      <div className="col s6 mb-1">
                        <small>Subtotal</small>
                        <p className="grey lighten-3 p-1 rad-2">₱ {currentOrder.checkout_subtotal.toFixed(2)}</p>
                      </div>
                      <div className="col s6 mb-1">
                        <small>Shipping</small>
                        <p className="grey lighten-3 p-1 rad-2">₱ {currentOrder.shipping.toFixed(2)}</p>
                      </div>
                      <div className="col s12 mb-1">
                        <small>Order Total</small>
                        <h5 className="grey lighten-3 p-1 rad-2 m-0">₱ {currentOrder.checkout_total.toFixed(2)}</h5>
                      </div>
                    </div>
                    <div className="row">
                      <div className="divider"></div>
                    </div>
                    <ul className="collapsible no-shadow">
                      <li className="flex-col start">
                        <div className="collapsible-header relative no-padding no-shadow grey-text text-darken-2">
                          <span className="main-title">Order Summary</span>
                          <i className="material-icons m-0">keyboard_arrow_down</i>
                        </div>
                        <div className="collapsible-body no-padding no-shadow full-width">
                          <div className="row mb-0">
                            <div className="col s12 mb-1">
                              <ul className="collection">
                                {currentOrder.order_items.map(orderItem => (
                                  orderItem.checkout_valid && (
                                    <li key={orderItem.id} className="collection-item p-0 pt-2 pb-2">
                                      <p className="title">{orderItem.product.name} - {orderItem.product_variant.name}</p>
                                      <p className="secondary-content title grey-text text-darken-2">₱ {orderItem.total_price.toFixed(2)}</p>
                                      <p className="grey-text">{orderItem.quantity} x ₱ {orderItem.product_variant.price.toFixed(2)}</p>
                                    </li>
                                  )
                                ))}
                                <li className="collection-item p-0">
                                  <h5 className="secondary-content grey-text text-darken-2 mb-0">₱ {currentOrder.checkout_subtotal.toFixed(2)}</h5>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="mt-3 flex-col start">
                        <div className="collapsible-header relative no-padding no-shadow grey-text text-darken-2">
                          <span className="main-title">Other Details</span>
                          <i className="material-icons m-0">keyboard_arrow_down</i>
                        </div>
                        <div className="collapsible-body no-padding no-shadow full-width">
                          <div className="row mb-0">
                            <div className="col s12 m6 mb-1">
                              <small>First Name</small>
                              <p className="grey lighten-4 p-1 rad-2">{currentOrder.first_name}</p>
                            </div>
                            <div className="col s12 m6 mb-1">
                              <small>Last Name</small>
                              <p className="grey lighten-4 p-1 rad-2">{currentOrder.last_name}</p>
                            </div>
                            <div className="col s12 mb-1">
                              <small>Contact</small>
                              <p className="grey lighten-4 p-1 rad-2">{currentOrder.contact}</p>
                            </div>
                            <div className="col s12 mb-1">
                              <small>Email</small>
                              <p className="grey lighten-4 p-1 rad-2">{currentOrder.email}</p>
                            </div>
                            <div className="col s12 mb-1">
                              <small>Gender</small>
                              <p className="grey lighten-4 p-1 rad-2">{currentOrder.gender}</p>
                            </div>
                            <div className="col s12 mb-1">
                              <small>Description</small>
                              <p className="grey lighten-4 p-1 rad-2 summary">{currentOrder.description}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="active mt-3 flex-col start">
                        <div className="collapsible-header relative no-padding no-shadow grey-text text-darken-2">
                          <span className="main-title">Payment Methods</span>
                          <i className="material-icons m-0">keyboard_arrow_down</i>
                        </div>
                        <div className="collapsible-body no-padding no-shadow full-width pt-3">
                          {/* <div className="row">
                            <div className="col s12">
                              <div id="paypal-button-container" className="center"></div>
                            </div>
                          </div>
                          <div className="row valign-wrapper">
                            <div className="or-divider">
                              <hr/>
                              <p>OR</p>
                              <hr/>
                            </div>
                          </div> */}
                          <div className="row">
                            <div className="col s12 center">
                              <button className="btn btn-large full-width darken-1 green bold mt-1 mxw-750" onClick={() => {
                                proceedWithCOD({
                                  history,
                                  type: 'food',
                                  query: `?order_seller=${currentOrder.seller.id}`
                                })
                              }}>Proceed with COD</button>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          ) : <section className="section section-delivery-payments"></section>
        ) : (
          <Redirect to='/food'/>
        )
      )
    ) : (
      <Redirect to='/food'/>
    )
  )
}

FoodPayment.propTypes = {
  finalizeTransaction: PropTypes.func.isRequired,
  proceedWithCOD: PropTypes.func.isRequired,
  getCurrentOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics
});

export default connect(mapStateToProps, { getCurrentOrder, finalizeTransaction, proceedWithCOD })(FoodPayment);