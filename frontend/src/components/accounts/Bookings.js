import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import BookingItem from './BookingItem'
import Preloader from '../../components/common/Preloader'

import { getOrders, setCurrentOnly, cancelOrder } from '../../actions/logistics'


const Bookings = ({
  auth: {
    user
  },
  logistics: {
    ordersLoading,
    orders,
    currentOnly
  },
  getOrders,
  setCurrentOnly,
  cancelOrder
}) => {
  const history = useHistory()

  const [order, setOrder] = useState('');
  const [showCurrentOnly, setShowCurrentOnly] = useState(false);

  const [orderToDelete, setOrderToDelete] = useState('');
  
  useEffect(() => {
    setCurrentOnly({
      bool: showCurrentOnly
    })
  }, [showCurrentOnly]);
  
  useEffect(() => {
    getOrders({
      getMore: false,
    })
  }, [currentOnly]);
  
  useEffect(() => {
    if (!ordersLoading) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
      $('.modal').modal({
        dismissible: true,
        inDuration: 300,
        outDuration: 200,
      });
    } else {
      $('.loader').show();
      $('.middle-content').hide();
    }
  }, [ordersLoading]);

  return (
    !user.groups.includes('rider') ? (
      <section className="section section-orders">
        <div className="container">
          <h5 className="mb-4">My Bookings</h5>
          <div className="switch mb-3">
            <label className="fs-16">
              Show Current Only
              <input type="checkbox" onChange={e => setShowCurrentOnly(e.target.checked)}/>
              <span className="lever"></span>
            </label>
          </div>
          <ul>
            {!ordersLoading ? (
              orders !== null && (
                orders.results.map((order, index) => (
                  <BookingItem key={order.id} order={order} orders={orders} index={index} ordersLoading={ordersLoading} setOrder={setOrder} setOrderToDelete={setOrderToDelete}/>
                ))
              )
            ) : (
              <div className="flex-col center relative preloader-wrapper">
                <Preloader color="green" size="small" adds=""/>
              </div>
            )}
          </ul>
        </div>
        <div id="ordermodal" className="modal modal-fixed-footer supermodal">
          {order === '' ? (
            <div className="full-height flex-col middle center relative preloader-wrapper pb-5">
              <Preloader color="green" size="big" adds="visible"/>
            </div>
          ) : (
            <Fragment>
              <div className="modal-content">
                <h5 className="mt-0 mb-2">ORDER TRACKER <small>({order.ref_code})</small></h5>
                <div className="row center">
                  {order.is_claimed ? (
                    <Fragment>
                      <div className="col s12">
                        <i className="material-icons green-text text-lighten-2">more_vert</i>
                      </div>
                      <div className="col s12 mb-1 flex-col center">
                        <h6 className="valign-wrapper green-text text-lighten-2"><i className="material-icons mr-1">search</i> RIDER FOUND</h6>
                      </div>
                      <div className="col s12 mb-1 flex-row center middle">
                        <div className="bg-cover circle" style={{ backgroundImage: `url(${order.rider.picture}`, height: '100px', width: '100px'}}></div>
                        <div className="ml-2 flex-col start grey-text">
                          <p className="m-0 fw-6">{order.rider.name}</p>
                          <p className="m-0">{order.rider.contact}</p>
                          <p className="m-0 fs-17 fw-6">{order.rider.plate_number}</p>
                        </div>
                      </div>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <div className="col s12">
                        <i className="material-icons blue-text">more_vert</i>
                      </div>
                      <div className="col s12 mb-1 flex-col center">
                        <h6 className="valign-wrapper blue-text"><i className="material-icons mr-1">search</i> Searching for a rider</h6>
                      </div>
                    </Fragment>
                  )}
                  {order.order_type === 'food' ? (
                    order.is_claimed && order.is_pickedup ? (
                      <Fragment>
                        <div className="col s12">
                          <i className="material-icons green-text text-lighten-2">more_vert</i>
                        </div>
                        <div className="col s12 mb-1 flex-col center">
                          <h6 className="valign-wrapper green-text text-lighten-2"><i className="material-icons mr-1">room_service</i>ORDER HAS BEEN PICKED UP</h6>
                        </div>
                      </Fragment>
                    ) : (
                      order.is_claimed ? (
                        <Fragment>
                          <div className="col s12">
                            <i className="material-icons blue-text">more_vert</i>
                          </div>
                          <div className="col s12 mb-1 flex-col center">
                            <h6 className="valign-wrapper blue-text"><i className="material-icons mr-1">room_service</i>Your food is being prepared</h6>
                          </div>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <div className="col s12">
                            <i className="material-icons grey-text">more_vert</i>
                          </div>
                          <div className="col s12 mb-1 flex-col center">
                            <h6 className="valign-wrapper grey-text"><i className="material-icons mr-1">room_service</i>Your food is being prepared</h6>
                          </div>
                        </Fragment>
                      )
                    )
                  ) : (
                    order.is_claimed && order.is_pickedup ? (
                      <Fragment>
                        <div className="col s12">
                          <i className="material-icons green-text text-lighten-2">more_vert</i>
                        </div>
                        <div className="col s12 mb-1 flex-col center">
                          <h6 className="valign-wrapper green-text text-lighten-2"><i className="fas fa-box mr-1"></i>PARCEL PICKED UP</h6>
                        </div>
                      </Fragment>
                    ) : (
                      order.is_claimed ? (
                        <Fragment>
                          <div className="col s12">
                            <i className="material-icons blue-text">more_vert</i>
                          </div>
                          <div className="col s12 mb-1 flex-col center">
                            <h6 className="valign-wrapper blue-text"><i className="material-icons mr-1">two_wheeler</i> Rider is heading to pickup location</h6>
                          </div>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <div className="col s12">
                            <i className="material-icons grey-text">more_vert</i>
                          </div>
                          <div className="col s12 mb-1 flex-col center">
                            <h6 className="valign-wrapper grey-text"><i className="material-icons mr-1">two_wheeler</i> Rider is heading to pickup location</h6>
                          </div>
                        </Fragment>
                      )
                    )
                  )}
                  {order.is_pickedup ? (
                    <Fragment>
                      <div className="col s12">
                        <i className="material-icons blue-text">more_vert</i>
                      </div>
                      <div className="col s12 mb-1 flex-col center">
                        <h6 className="valign-wrapper blue-text"><i className="material-icons mr-1">local_shipping</i>Your order is being delivered</h6>
                      </div>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <div className="col s12">
                        <i className="material-icons grey-text">more_vert</i>
                      </div>
                      <div className="col s12 mb-1 flex-col center">
                        <h6 className="valign-wrapper grey-text"><i className="material-icons mr-1">local_shipping</i>Your order is being delivered</h6>
                      </div>
                    </Fragment>
                  )}
                </div>
              </div>
            </Fragment>
          )}
          <div className="modal-footer">
            <a className="modal-close cancel-fixed"><i className="material-icons grey-text">close</i></a>
          </div>
        </div>
        <div id="confirmation-modal" className="modal">
          <div className="modal-content center">
            <h4>Are you sure?</h4>
            <a className="modal-action modal-close btn btn-large btn-extended red" onClick={() => cancelOrder({ id: orderToDelete })}>Cancel Order</a>
            <a className="modal-action modal-close cancel"><i className="material-icons grey-text">close</i></a>
          </div>
        </div>
      </section>
    ) : (
      <Redirect to="/"/>
    )
  )
}

Bookings.propTypes = {
  getOrders: PropTypes.func.isRequired,
  setCurrentOnly: PropTypes.func.isRequired,
  cancelOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getOrders, setCurrentOnly, cancelOrder })(Bookings);