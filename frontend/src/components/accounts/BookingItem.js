import React, { useRef, useCallback, Fragment } from 'react';
import { HashLink as Link } from 'react-router-hash-link';

import { connect } from 'react-redux';
import { getOrders } from '../../actions/logistics';
import moment from 'moment'

const BookingItem = ({ ordersLoading, order, orders, index, getOrders, setOrder }) => {
  const observer = useRef();
  const lastProductElement = useCallback(el => {
    if (ordersLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && orders.next !== null && !ordersLoading) {
        getOrders({
          getMore: true
        });
      }
    })
    if (el) observer.current.observe(el)
  }, [ordersLoading, orders.next]);
  
  return (
    <Fragment>
      <li className="card mb-2" ref={orders.results.length === index + 1 ? lastProductElement : undefined }>
        <ul className="collection no-shadow">
          <li className="row collection-item">
            <div className="col s9 p-0 flex-row">
              <p className="fw-6 fs-17 mb-0 mt-0 grey-text text-darken-2 grey lighten-3 rad-4 pt-1 pb-1 pl-2 pr-2">Order <span className="ml-1 light-blue-text fs-16">#{order.ref_code}</span></p>
              {/* <p className="grey-text text-lighten-1 ml-2">Date Ordered: {moment(order.date_ordered).format('ll')}</p> */}
            </div>
            {!order.is_delivered ? (
                !order.is_canceled ? (
                  <div className="col s3 flex-col end p-0">
                    <button data-target="ordermodal" className="modal-trigger btn fw-6 rad-4 orange pulse flex-row middle" onClick={() => setOrder(order)}>Status</button>
                  </div>
                ) : (
                  <div className="col s3 flex-col end p-0 mt-1">
                    <i>Order Canceled</i>
                  </div>
                )
              ) : (
                !order.is_reviewed ? (
                  <Fragment>
                    <div className="col s3 flex-col end p-0">
                      <Link to={`/order_review/${order.id}`} className="chip amber white-text right waves-effect waves-orange">REVIEW</Link>
                    </div>
                    <div className="col s12 flex-col end p-0">
                      <small>delivered by {order.rider.name}</small>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    <div className="col s3 flex-col end p-0">
                      <div className="chip grey lighten-2 white-text right"><i>Reviewed</i></div>
                    </div>
                    <div className="col s12 flex-col end p-0">
                      <small>delivered by {order.rider.name}</small>
                    </div>
                  </Fragment>
                )
            )}
          </li>
          {order.order_type === 'food' ? (
            order.order_items && (
              order.order_items.map(orderItem => (
                <li key={orderItem.id} className="collection-item avatar">
                  <div className="grey lighten-2 circle bg-cover" style={{ backgroundImage: `url(${orderItem.product.thumbnail})` }}></div>
                  <p className="title">{orderItem.product.name} - {orderItem.product_variant.name}</p>
                  {orderItem.is_delivered && (
                    orderItem.is_reviewed ? (
                      <div className="chip grey lighten-2 white-text right"><i>Reviewed</i></div>
                    ) : (
                      <Link to={`/product_review/${orderItem.id}`} className="chip amber white-text right waves-effect waves-orange">REVIEW</Link>
                    )
                  )}
                  <p className="grey-text">{orderItem.quantity} x ₱ {orderItem.ordered_price.toFixed(2)}</p>
                  <p className="title">₱ {(orderItem.quantity*orderItem.ordered_price).toFixed(2)}</p>
                </li>
              ))
            )
          ) : (
            <div className="row mb-0 mt-2">
              <div className="col s4 m3 l3 mb-1">
                <small>Height</small>
                <p className="grey lighten-4 p-1 rad-2">{order.height}"</p>
              </div>
              <div className="col s4 m3 l3 mb-1">
                <small>Width</small>
                <p className="grey lighten-4 p-1 rad-2">{order.width}"</p>
              </div>
              <div className="col s4 m3 l3 mb-1">
                <small>Length</small>
                <p className="grey lighten-4 p-1 rad-2">{order.length}"</p>
              </div>
              <div className="col s12 m3 l3 mb-1">
                <small>Weight</small>
                <p className="grey lighten-4 p-1 rad-2">{order.weight}{order.unit}</p>
              </div>
              <div className="col s12 mb-1">
                <small>Description</small>
                <p className="grey lighten-4 p-1 rad-2">{order.description}</p>
              </div>
            </div>
          )}
          <li className="collection-item">
              <Fragment>
                <div className="row m-0">
                  <div className="col s12 p-0">
                    <p className="left m-0 fw-6">{order.order_type === 'food' ? 'Restaurant' : 'Pickup'} Address: <i className="fw-5 fs-14">{order.loc1_address}</i></p>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col s12 p-0">
                    <p className="left m-0 fw-6">Delivery Address: <i className="fw-5 fs-14">{order.loc2_address}</i></p>
                  </div>
                </div>
              </Fragment>
          </li>
          <li className="collection-item">
            {order.order_type === 'food' && (
              <Fragment>
                <div className="row m-0">
                  <div className="col s6 p-0">
                    <p className="left m-0">Subtotal</p>
                  </div>
                  <div className="col s6 flex-col end p-0">
                    <p className="left m-0">₱ {order.ordered_subtotal.toFixed(2)}</p>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col s6 p-0">
                    <p className="left m-0">Shipping</p>
                  </div>
                  <div className="col s6 flex-col end p-0">
                    <p className="left m-0">₱ {order.ordered_shipping.toFixed(2)}</p>
                  </div>
                </div>
              </Fragment>
            )}
            <div className="row m-0 mt-1">
              <div className="col s6 p-0">
                <p className="fw-6 fs-17 m-0">Total</p>
              </div>
              <div className="col s6 flex-col end p-0">
                <p className="fw-6 fs-17 m-0">₱ {order.total.toFixed(2)}</p>
              </div>
            </div>
          </li>
          {!order.is_claimed && (
            <li className="collection-item">
              <div className="col s12 waves-effect">
                <p className="flex-row m-0"><i className="material-icons fs-18">close</i><span className="ml-1 cancel-order">CANCEL ORDER</span></p>
              </div>
            </li>
          )}
        </ul>
      </li>
    </Fragment>
  )
}

export default connect(null, { getOrders })(BookingItem);