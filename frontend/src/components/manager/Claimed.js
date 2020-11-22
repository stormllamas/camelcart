import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import moment from 'moment'

import Preloader from '../common/Preloader'
import Pagination from '../common/Pagination'
import ManagerBreadcrumbs from './ManagerBreadcrumbs'

import { pickupOrderItem, pickupOrder, cancelOrder, getOrders, getOrder } from '../../actions/manager'

const Claimed = ({
  manager: {
    ordersLoading,
    orders,
    orderLoading,
    order
  },
  getOrders,
  getOrder,
  pickupOrderItem, pickupOrder,
  cancelOrder,
  setCurLocation
}) => {
  const history = useHistory()
  const query = new URLSearchParams(history.location.search);

  const [keywords, setKeywords] = useState('')
  const [page, setPage] = useState(1)

  const [currentMap, setCurrentMap] = useState('');
  const [pickupMarker, setPickupMarker] = useState('');
  const [deliveryMarker, setDeliveryMarker] = useState('');

  const [addressFocus, setAddressFocus] = useState('');

  const [orderToDelete, setOrderToDelete] = useState('');

  const onSubmit = async () => {
    if (order.order_type === 'food') {
      const checkedBoxes = $('.check:checked:not([disabled])')
      checkedBoxes.each(async (index, checkedBox) => {
        pickupOrderItem({
          id: checkedBox.value
        })
      })
    } else if (order.order_type === 'delivery') {
      pickupOrder({
        id: order.id
      })
    }
  }
  
  const showGoogleMaps = () => {
    const centerLatLng = new google.maps.LatLng(13.938080242321387, 121.61336104698454)

    const LUCENA_BOUNDS = {
      north: 13.990870,
      south: 13.889484,
      west: 121.554958,
      east: 121.709314,
    }
    // Map options
    const mapOptions = {
      zoom: 14,
      restriction: {
        latLngBounds: LUCENA_BOUNDS,
        strictBounds: false
      },
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      streetViewControl: false,
      scaleControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: centerLatLng
    }

    // Create and set map
    const map = new google.maps.Map(document.getElementById('googlemap'), mapOptions)
    setCurrentMap(map);

    // Display a caption in the map with user location
    const infoWindow = new google.maps.InfoWindow;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent('You');
        infoWindow.open(map);
        // map.setCenter(pos);
      }, function() {
      });
    }
  };

  let pickupMarkerDown;
  let deliveryMarkerDown;

  const addMarkers = ({
    pickupLat, 
    pickupLng,
    deliveryLat,
    deliverLng,
    focus
  }) => {
    // Deletes previous marker from both confirmed and current sessions
    pickupMarker !== '' && pickupMarker.setMap(null)
    deliveryMarker !== '' && deliveryMarker.setMap(null)
    pickupMarkerDown && pickupMarkerDown.setMap(null)
    deliveryMarkerDown && deliveryMarkerDown.setMap(null)
    
    const pickupLatLng = {lat: parseFloat(pickupLat), lng: parseFloat(pickupLng)}
    const deliveryLatLng = {lat: parseFloat(deliveryLat), lng: parseFloat(deliverLng)}

    const newPickupMarker = new google.maps.Marker({
      position: pickupLatLng,
      map: currentMap,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      },
      draggable: false,
      animation: google.maps.Animation.DROP
    });

    const newDeliveryMarker = new google.maps.Marker({
      position: deliveryLatLng,
      icon: {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      },
      map: currentMap,
      draggable: false,
      animation: google.maps.Animation.DROP
    });

    setPickupMarker(newPickupMarker);
    pickupMarkerDown = newPickupMarker
    newPickupMarker.setMap(currentMap)

    setDeliveryMarker(newDeliveryMarker);
    deliveryMarkerDown = newDeliveryMarker
    newDeliveryMarker.setMap(currentMap)

    if (focus === 'pickup') {
      currentMap.setCenter(newPickupMarker.getPosition());
    } else if (focus === 'delivery') {
      currentMap.setCenter(newDeliveryMarker.getPosition());
    }
  }
  
  useEffect(() => {
    setCurLocation(history.location)
  }, [history]);
  
  useEffect(() => {
    if (!ordersLoading) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
  
      $('.modal').modal({
        dismissible: true,
        inDuration: 300,
        outDuration: 200,
      });
      showGoogleMaps();
    } else {
      $('.loader').show();
      $('.middle-content').hide();
    }
  }, [ordersLoading]);

  useEffect(() => {
    const pageQuery = query.get('page')
    if (pageQuery) {
      if (pageQuery != page) {
        setPage(pageQuery)
      } else {
        getOrders({
          page: page,
          claimed: true,
          pickedup: false,
          delivered: false,
          keywords: keywords
        })
      }
    } else {
      setPage(1)
      getOrders({
        page: 1,
        claimed: true,
        pickedup: false,
        delivered: false,
        keywords: keywords
      })
    }
  }, [keywords, page]);
  
  useEffect(() => {
    if (order !== null && currentMap !== '') {
      addMarkers({
        pickupLat: order.loc1_latitude, 
        pickupLng: order.loc1_longitude,
        deliveryLat: order.loc2_latitude,
        deliverLng: order.loc2_longitude,
        focus: addressFocus
      })
    }
  }, [order]);
  
  return (
    !ordersLoading && (
      <Fragment>
        <div className="navbar-fixed">
          <nav id="admin-search" className="green">
            <div className="nav-wrapper">
              <form>
                <div className="input-field">
                  <input type="search" id="search" name="manager-search" placeholder="Search for a Reference Number" required onChange={e => setKeywords(e.target.value)}/>
                  <label htmlFor="manager-search" className="label-icon">
                    <i className="material-icons">search</i>
                  </label>
                  <i className="material-icons">close</i>
                </div>
              </form>
            </div>
          </nav>
        </div>
        <ManagerBreadcrumbs/>
        <section className="section section-undelivered admin">
          <div className="container widen">
            <div className="row mt-3">
              <div className="col flex-row middle s12">
                <a href="#" data-target="mobile-nav" className="sidenav-trigger grey-text text-darken-1 show-on-small-and-up mr-4 ml-2 pt-1">
                  <i className="material-icons">menu</i>
                </a>
                <h4 className="m-0 flex-row middle flow"><i className="material-icons fs-38 mr-2">pending_actions</i>Claimed Orders</h4>
              </div>
            </div>
            <div className="row table-row">
              <div className="col s12">
                <div className="card-panel white rad-3 no-shadow">
                  <div className="row m-0 mb-2">
                    <div className="col s12 m6 l6">
                      {!ordersLoading && orders.count > 50 ? <Pagination data={orders} setPage={setPage} pageSize={50} currentPage={page}/> : undefined}
                    </div>
                  </div>
                  <div className="row m-0 overflow-scroll">
                    <table className="bordered highlight">
                      <thead>
                        <tr className="grey lighten-3">
                          <th>Date Ordered</th>
                          <th>Ref Code</th>
                          <th className="center">Type</th>
                          <th className="center">Payment Needed</th>
                          <th className="center">Payment</th>
                          <th>Pickup Address</th>
                          <th>Delivery Address</th>
                          <th>Items</th>
                          <th>Order Total</th>
                          <th>Subtotal</th>
                          <th>Shipping</th>
                          <th className="pl-2 pr-2">Cancel</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.results.length > 0 ? (
                          orders.results.map(order => (
                            <tr key={order.id}>
                              <td className="mw-medium">{moment(order.date_ordered).format('lll')}</td>
                              <td><a href="" data-target="order-modal" className="mw-small modal-trigger fw-6 blue-text text-lighten-2" onClick={() => getOrder({ id:order.id })}>{order.ref_code}</a></td>
                              <td className="mw-small center">{order.order_type}</td>
                              <td className={`fw-6 mw-medium center ${order.rider_payment_needed === true ? 'green-text' : ''}`}>{order.rider_payment_needed === true ? 'Yes' : 'No'}</td>
                              <td className={`fw-6 mw-medium center ${order.payment_type === 1 ? 'orange-text' : 'green-text'}`}>{order.payment_type === 1 ? 'COD' : 'Card'}</td>
                              <td className="mw-large"><p className="m-0">{order.order_type === 'food' && order.seller.name}</p><a href="" data-target="addressmodal" className="mw-small modal-trigger fw-6 green-text text-lighten-1" onClick={() => {getOrder({ id:order.id }), setAddressFocus('pickup')}}>{order.loc1_address}</a></td>
                              <td className="mw-large"><a href="" data-target="addressmodal" className="mw-small modal-trigger fw-6 blue-text text-lighten-1" onClick={() => {getOrder({ id:order.id }), setAddressFocus('delivery')}}>{order.loc2_address}</a></td>
                              <td className="mw-medium">{order.count} items</td>
                              <td className="mw-medium">₱ {order.total.toFixed(2)}</td>
                              <td className="mw-medium">₱ {order.subtotal.toFixed(2)}</td>
                              <td className="mw-medium">₱ {order.ordered_shipping.toFixed(2)}</td>
                              <td className="center">
                                <a href="#" className="modal-trigger" data-target="confirmation-modal" onClick={() => setOrderToDelete(order.id)}>
                                  <i className="material-icons red-text">delete_forever</i>
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="12" className="grey-text center fs-20 pt-5 pb-5 full-height uppercase">No more orders</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="order-modal" className="modal modal-fixed-footer supermodal">
            {orderLoading ? (
              <div className="flex-col full-height middle center relative preloader-wrapper pb-5">
                <Preloader color="green" size="big" adds="visible"/>
              </div>
            ) : (
              <Fragment>
                <div className="modal-content">
                  <div className="row m-0">
                    <div className="col s12 m6 l6">
                      <h5 className="mt-0 mb-2">Order Summary <small>({order.ref_code})</small></h5>
                    </div>
                    <div className="col s12 m6 l6 flex-row right-middle">
                      <button className={`btn green right ${order.order_type === 'delivery' ? 'modal-close' : (order.order_items.filter(orderItem => orderItem.is_pickedup === false).length < 2 ? 'modal-close' : '')}`} onClick={() => onSubmit()}>Mark as Picked Up</button>
                    </div>
                  </div>
                  {order.order_type === 'food' ? (
                    <Fragment>
                      <ul className="collection transparent no-shadow rad-3">
                        {order.order_items.map(orderItem => (
                          <li key={orderItem.id} className="collection-item flex-row middle">
                            <div className="mw-small manager-checklist flex-col middle center pr-2">
                              <div className="checklist-item flex-col middle center">
                                <input id={`${order.ref_code}-${orderItem.id}`} type="checkbox" className="check" name={`${order.ref_code}-${orderItem.id}`} value={orderItem.id} defaultChecked={orderItem.is_pickedup === true ? true : false} disabled={orderItem.is_pickedup === true ? true : false}/>
                                <label className="btn-check text-center" htmlFor={`${order.ref_code}-${orderItem.id}`}><i className="fas fa-check"></i></label>
                              </div>
                            </div>
                            <div className="collection-item avatar transparent">
                              <div className="grey lighten-2 circle bg-cover" style={{ backgroundImage: `url(${orderItem.product.thumbnail})` }}>contacts</div>
                              <p className="title">{orderItem.product.name} - {orderItem.product_variant.name}</p>
                              <p className="grey-text">{orderItem.quantity} x ₱ {orderItem.ordered_price.toFixed(2)}</p>
                              <p className="title">₱ {(orderItem.quantity*orderItem.ordered_price).toFixed(2)}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <p className="fs-16 m-0 ml-2">Subtotal: <span className="fw-4 fs-16 ml-2">₱ {order.subtotal.toFixed(2)}</span></p>
                      <p className="fs-16 m-0 ml-2">Delivery: <span className="fw-4 fs-16 ml-2">₱ {order.ordered_shipping.toFixed(2)}</span></p>
                      <p className="fw-6 fs-22 m-0 ml-2">Total: <span className="fw-4 fs-18 ml-2">₱ {order.total.toFixed(2)}</span></p>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <div className="row">
                        <div className="col s12 m6 mb-1">
                          <small>First Name</small>
                          <p className="grey lighten-3 p-1 m-0 rad-2 summary">{order.first_name}</p>
                        </div>
                        <div className="col s12 m6 mb-1">
                          <small>Last Name</small>
                          <p className="grey lighten-3 p-1 m-0 rad-2 summary">{order.last_name}</p>
                        </div>
                        <div className="col s12 mb-1">
                          <small>Contact</small>
                          <p className="grey lighten-3 p-1 m-0 rad-2 summary">{order.contact}</p>
                        </div>
                        <div className="col s12 mb-1">
                          <small>Email</small>
                          <p className="grey lighten-3 p-1 m-0 rad-2 summary">{order.email}</p>
                        </div>
                        <div className="col s12 mb-1">
                          <small>Gender</small>
                          <p className="grey lighten-3 p-1 m-0 rad-2 summary">{order.gender}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="divider"></div>
                      </div>
                      <div className="row">
                        <div className="col s12 m4 mb-1">
                          <small>Item Weight</small>
                          <p className="grey lighten-3 p-1 m-0 rad-2 summary">{order.weight}{order.unit}</p>
                        </div>
                        <div className="col s12 m4 mb-1">
                          <small>Item Height</small>
                          <p className="grey lighten-3 p-1 m-0 rad-2 summary">{order.height}</p>
                        </div>
                        <div className="col s12 m4 mb-1">
                          <small>Item Width</small>
                          <p className="grey lighten-3 p-1 m-0 rad-2 summary">{order.width}</p>
                        </div>
                        <div className="col s12 mb-1">
                          <small>Item Length</small>
                          <p className="grey lighten-3 p-1 m-0 rad-2 summary">{order.length}</p>
                        </div>
                        <div className="col s12 mb-1">
                          <small>Description</small>
                          <p className="grey lighten-3 p-1 m-0 rad-2 summary">{order.description}</p>
                        </div>
                      </div>
                      <p className="fw-6 fs-22 m-0 ml-2">Delivery Total: <span className="fw-4 fs-18 ml-2">₱ {order.ordered_shipping.toFixed(2)}</span></p>
                    </Fragment>
                  )}
                </div>
              </Fragment>
            )}
            <div className="modal-footer">
              <a className="modal-close cancel-fixed"><i className="material-icons grey-text">close</i></a>
            </div>
          </div>
          <div id="addressmodal" className="modal supermodal">
            <div id="googlemap"></div>
            <div className="modal-footer">
              <a className="modal-action modal-close cancel-fixed"><i className="material-icons grey-text">close</i></a>
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
      </Fragment>
    )
  )
}

Claimed.propTypes = {
  getOrders: PropTypes.func.isRequired,
  getOrder: PropTypes.func.isRequired,
  pickupOrderItem: PropTypes.func.isRequired,
  pickupOrder: PropTypes.func.isRequired,
  cancelOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  manager: state.manager,
});

export default connect(mapStateToProps, { getOrders, getOrder, pickupOrderItem, pickupOrder, cancelOrder })(Claimed);