import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import AuthPrompt from '../layout/AuthPrompt'

import { finalizeTransaction, getCurrentOrder, proceedWithCOD } from '../../actions/logistics'
import { getDistance } from '../../actions/google';



const DeliveryPayments = ({
  auth: { userLoading, isAuthenticated },
  logistics: { currentOrder, currentOrderLoading, completeOrderLoading },
  getCurrentOrder,
  finalizeTransaction,
  proceedWithCOD,
}) => {
  const history = useHistory()

  const [socket, setSocket] = useState('')
  
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
              description: "Trike delivery request on "+ getDateNow(),
              amount: {
                currency_code: "PHP",
                value: currentOrder.total,
                breakdown: {
                  shipping: {
                    currency_code: "PHP",
                    value: currentOrder.shipping,
                  },
                },
              },
              payee: {
                email: 'support@trikeph.com',
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
            type: 'delivery',
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
    isAuthenticated && (
      getCurrentOrder({
        type: 'delivery',
        query: `?for_checkout=true`
      })
    )
  }, [])

  useEffect(() => {
    if(!currentOrderLoading) {
      if (checkCurrentOrder(currentOrder)) {
        M.updateTextFields();
    
        $('.collapsible').collapsible({
          accordion: false
        });
        // renderPaypalButtons()
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
  
  useEffect(() => {
    let wsStart = 'ws://'
    let port = ''
    if (window.location.protocol === 'https:') {
      wsStart = 'wss://'
      port = ':8001'
    }
    let endpoint = wsStart + window.location.host + port
    $(document).ready(function () {
      setSocket(new ReconnectingWebSocket(endpoint+'/order_update/'))
    });
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = function(e){
        console.log('message', e)
      }
      socket.onopen = function(e){
        console.log('open', e)
      }
      socket.onerror = function(e){
        console.log('error', e)
      }
      socket.onclose = function(e){
        console.log('close', e)
      }
    }
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [socket]);

  return (
    isAuthenticated ? (
      !currentOrderLoading && (
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
                    <div className="col s12 mb-1">
                      <small>Total Shipping</small>
                      <h5 className="grey lighten-3 p-1 rad-2 mt-0">₱ {currentOrder.shipping.toFixed(2)}</h5>
                    </div>
                  </div>
                  <div className="row">
                    <div className="divider"></div>
                  </div>
                  <ul className="collapsible no-shadow">
                    <li className="flex-col start">
                      <div className="collapsible-header relative no-padding no-shadow grey-text text-darken-2">
                        <span className="main-title">Show Other Details</span>
                        <i className="material-icons m-0">keyboard_arrow_down</i>
                      </div>
                      <div className="collapsible-body no-padding no-shadow full-width">
                        <div className="row">
                          <div className="col s12 m6 mb-1">
                            <small>First Name</small>
                            <p className="grey lighten-4 p-1 rad-2 summary">{currentOrder.first_name}</p>
                          </div>
                          <div className="col s12 m6 mb-1">
                            <small>Last Name</small>
                            <p className="grey lighten-4 p-1 rad-2 summary">{currentOrder.last_name}</p>
                          </div>
                          <div className="col s12 mb-1">
                            <small>Contact</small>
                            <p className="grey lighten-4 p-1 rad-2 summary">{currentOrder.contact}</p>
                          </div>
                          <div className="col s12 mb-1">
                            <small>Email</small>
                            <p className="grey lighten-4 p-1 rad-2 summary">{currentOrder.email}</p>
                          </div>
                          <div className="col s12 mb-1">
                            <small>Gender</small>
                            <p className="grey lighten-4 p-1 rad-2 summary">{currentOrder.gender}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="divider"></div>
                        </div>
                        <div className="row">
                          <div className="col s12 m4 mb-1">
                            <small>Item Weight</small>
                            <p className="grey lighten-4 p-1 rad-2 summary">{currentOrder.weight}{currentOrder.unit}</p>
                          </div>
                          <div className="col s12 m4 mb-1">
                            <small>Item Height</small>
                            <p className="grey lighten-4 p-1 rad-2 summary">{currentOrder.height} inches</p>
                          </div>
                          <div className="col s12 m4 mb-1">
                            <small>Item Width</small>
                            <p className="grey lighten-4 p-1 rad-2 summary">{currentOrder.width} inches</p>
                          </div>
                          <div className="col s12 mb-1">
                            <small>Item Length</small>
                            <p className="grey lighten-4 p-1 rad-2 summary">{currentOrder.length} inches</p>
                          </div>
                          <div className="col s12 mb-1">
                            <small>Description</small>
                            <p className="grey lighten-4 p-1 rad-2 summary linebreak">{currentOrder.description}</p>
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
                                type: 'delivery',
                                socket: socket,
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
        ) : (
          <Redirect to='/delivery'/>
        )
      )
    ) : (
      <AuthPrompt/>
    )
  )
}

DeliveryPayments.propTypes = {
  getDistance: PropTypes.func.isRequired,
  finalizeTransaction: PropTypes.func.isRequired,
  proceedWithCOD: PropTypes.func.isRequired,
  getCurrentOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics
});

export default connect(mapStateToProps, { getDistance, getCurrentOrder, finalizeTransaction, proceedWithCOD })(DeliveryPayments);